import { Schema, model, InferSchemaType } from 'mongoose';
import { swapSchema } from './swapModel';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
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

type User = InferSchemaType<typeof userSchema>;

const UserModel = model<User>('User', userSchema);
export default UserModel;
