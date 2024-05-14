import mongoose from "mongoose";
import { ModuleCode, RawLesson } from "./modules";

export type User = {
    readonly _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    swapRequests: Swap[];
    timestamps: Date;
};

export type Swap = Readonly<{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    courseId: ModuleCode;
    current: RawLesson;
    request: RawLesson;
    status: boolean;
    timestamps: Date;
}>;
