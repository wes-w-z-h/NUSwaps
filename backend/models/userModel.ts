import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, User, UserPayload } from '../types/api.js';
import { swapSchema } from './swapModel.js';

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
    swapRequests: {
      type: [swapSchema], // default is an empty array
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
      swapRequests: this.swapRequests,
      token,
    };
  }
);

const UserModel = model<IUser, User>('User', userSchema);
export default UserModel;
