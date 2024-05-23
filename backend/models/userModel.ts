/* eslint-disable no-underscore-dangle */
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, User } from '../types/api.js';
import { swapSchema } from './swapModel.js';

const userSchema = new Schema<IUser, User, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      get: (): string => '*******',
      // default: "",
    },
    swapRequests: {
      type: [swapSchema], // default is an empty array
      required: false,
    },
  },
  { timestamps: true, toJSON: { getters: true } } // createdAt option
);

userSchema.index({ username: 1 }, { unique: true });

userSchema.method('createResponse', function createReponse() {
  return {
    id: this._id,
    username: this.username,
    swapRequests: this.swapRequests,
  };
});

const UserModel = model<IUser, User>('User', userSchema);
export default UserModel;
