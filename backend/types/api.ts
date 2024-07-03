import { Types, Model } from 'mongoose';
import { ModuleCode } from './modules.js';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
}

export interface IUserMethods {
  createResponse(token?: string): UserPayload;
}

export type User = Model<IUser, {}, IUserMethods>;

export type UserPayload = {
  id: Types.ObjectId;
  email: string;
  token?: string;
};

export type SwapStatus = 'UNMATCHED' | 'MATCHED' | 'CONFIRMED' | 'COMPLETED';

export interface ISwap {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: ModuleCode;
  lessonType: string;
  current: string;
  request: string;
  status: SwapStatus;
  match: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
  id: Types.ObjectId;
}

export interface ISwapMethods {
  createResponse(): SwapPayload;
}

export type Swap = Model<ISwap, {}, ISwapMethods>;

export type SwapPayload = {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: ModuleCode;
  lessonType: string;
  current: string;
  request: string;
  status: SwapStatus;
};

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface IMatch {
  _id: Types.ObjectId;
  courseId: ModuleCode;
  lessonType: string;
  swaps: [Types.ObjectId];
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
}

export interface IMatchMethods {
  getNewStatus(): Promise<MatchStatus>;
}

export type Match = Model<IMatch, {}, IMatchMethods>;

export type APIResponse = {
  success: boolean;
  error?: {
    code: number;
    message: string;
  };
  payload: UserPayload | SwapPayload;
};
