import { Document } from 'mongoose';
export type SubmissionDocument = Submission & Document;
export declare class Submission {
    title: string;
    doi: string;
    email: string;
    author: string;
    status: 'pending' | 'approved' | 'rejected';
    moderatorId: string;
    reviewComment: string;
    reviewTime: Date;
}
export declare const SubmissionSchema: import("mongoose").Schema<Submission, import("mongoose").Model<Submission, any, any, any, Document<unknown, any, Submission, any, {}> & Submission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Submission, Document<unknown, {}, import("mongoose").FlatRecord<Submission>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Submission> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
