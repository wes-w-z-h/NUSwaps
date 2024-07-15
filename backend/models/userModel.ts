import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, User, UserPayload } from '../types/api.js';

const userSchema = new Schema<IUser, User, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // validation is also done in the controller
      validate: {
        validator(val: string): boolean {
          return val.endsWith('@u.nus.edu');
        },
        message: 'Invalid domain name must be: @u.nus.edu',
      },
    },
    password: {
      type: String,
      required: true,
      // default: "",
    },
    telegramId: {
      type: Number,
      unique: true,
      required: false,
    },
  },
  { timestamps: true } // createdAt option
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.method(
  'createResponse',
  function createResponse(token?: string): UserPayload {
    return {
      /* eslint-disable no-underscore-dangle */
      id: this._id,
      email: this.email,
      token,
    };
  }
);

const UserModel = model<IUser, User>('User', userSchema);
export default UserModel;
