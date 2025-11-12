import { HttpStatus } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    reviewSubmission(submissionId: string, reviewDto: ReviewSubmissionDto, req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: import("./schemas/submission.schema").Submission;
    }>;
    findReviewed(): Promise<{
        status: HttpStatus;
        data: import("./schemas/submission.schema").Submission[];
    }>;
}
