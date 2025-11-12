import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { UsersService } from '../users/users.service';
export declare class SubmissionsService {
    private submissionModel;
    private usersService;
    constructor(submissionModel: Model<SubmissionDocument>, usersService: UsersService);
    reviewSubmission(submissionId: string, reviewDto: ReviewSubmissionDto, moderatorId: string): Promise<Submission>;
    findReviewed(): Promise<Submission[]>;
}
