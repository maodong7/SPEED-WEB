import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AddCollectionDto, RemoveCollectionDto } from './dto/collection.dto';
import { JwtService } from '@nestjs/jwt';
import { Submission, SubmissionDocument } from '../submissions/schemas/submission.schema';
export declare class UsersService {
    private userModel;
    private submissionModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, submissionModel: Model<SubmissionDocument>, jwtService: JwtService);
    addCollection(userId: string, dto: AddCollectionDto): Promise<User>;
    removeCollection(userId: string, dto: RemoveCollectionDto): Promise<User>;
    getCollections(userId: string): Promise<Submission[]>;
}
