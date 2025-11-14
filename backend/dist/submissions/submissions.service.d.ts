import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class SubmissionsService {
    private submissionModel;
    constructor(submissionModel: Model<SubmissionDocument>);
    create(createSubmissionDto: CreateSubmissionDto, userId: string): Promise<Submission>;
    findAll(): Promise<Submission[]>;
    findOne(id: string): Promise<Submission>;
    findPending(): Promise<Submission[]>;
    findApproved(): Promise<Submission[]>;
    review(id: string, reviewDto: ReviewSubmissionDto, moderatorId: string): Promise<Submission>;
    remove(id: string, userId: string, isModerator: boolean): Promise<void>;
}
