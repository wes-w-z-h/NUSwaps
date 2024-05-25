import { Types, Model } from 'mongoose';
import { ModuleCode } from './modules.js';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  swapRequests?: [ISwap];
  createdAt: Date;
  updatedAt: Date;
  __v: string;
}

export interface IUserMethods {
  createResponse(): JSON;
}

export type User = Model<IUser, {}, IUserMethods>;

export interface ISwap {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: ModuleCode;
  lessonType: string;
  current: string;
  request: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
  id: Types.ObjectId;
}

export interface ISwapMethods {
  createResponse(): JSON;
}

export type Swap = Model<ISwap, {}, ISwapMethods>;
