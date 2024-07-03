import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';
import { sendVerification } from '../util/emailService.js';
import env from '../util/validEnv.js';

const createToken = (dataid: any, expiry: string = '5m'): string =>
  jwt.sign({ id: dataid }, env.JWT_KEY, { expiresIn: expiry });

const validateEmail = (val: string): boolean => {
  return val.endsWith('@u.nus.edu');
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const data = await UserModel.findOne({ email }).exec();
    if (!data) {
      throw createHttpError(404, 'User not found');
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      throw createHttpError(401, 'Unauthorised: check email & password');
    }

    const accessToken = createToken(data.id, '15m'); // short expiry time of 15 mins
    const refreshToken = createToken(data.id, '1d'); // longer expiry time of 1 day

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json(data.createResponse(accessToken));
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const { cookies } = req;
  try {
    if (!cookies?.jwt) {
      res.status(204); // no cookies
    }

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ msg: 'Cookie cleared' });
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  const { cookies } = req;
  try {
    if (!cookies?.jwt) {
      throw createHttpError(401, 'Unauthorised: missing refresh token');
    }

    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken, env.JWT_KEY, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ msg: 'Forbidden' });
      }
      const user = await UserModel.findById(decoded.id).exec();

      if (!user) {
        throw createHttpError(401, 'Unauthorised: no user found');
      }

      const accessToken = createToken(decoded.id, '15m');
      return res.status(200).json({ token: accessToken });
    });
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, 'Invalid request: missing field(s)');
    }

    const exists = await UserModel.findOne({ email });

    if (exists) {
      throw createHttpError(400, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 11);

    if (!validateEmail(email)) {
      throw createHttpError(
        400,
        'Invalid email address: needs to end with @u.nus.edu'
      );
    }

    await sendVerification(email, createToken({ email, passwordHash }));

    res.status(201).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = (jwt.verify(token, env.JWT_KEY) as JwtPayload).id;
    const { email, passwordHash } = decoded;

    const data = await UserModel.create({ email, password: passwordHash });

    if (!data) {
      res
        .status(400)
        .json({ message: 'Invalid token or unable to create user' });
      return;
    }

    const authToken = createToken(data.id);

    res.status(200).json(data.createResponse(authToken));
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const verifyRefreshToken: RequestHandler = async (req, res, next) => {
  const { cookies } = req;
  try {
    if (!cookies?.jwt) {
      throw createHttpError(401, 'Unauthorised: missing refresh token');
    }

    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken, env.JWT_KEY);

    res.status(200).json({ message: 'Valid token' });
  } catch (error) {
    next(createHttpError(403, 'Forbidden: invalid refresh token'));
  }
};
