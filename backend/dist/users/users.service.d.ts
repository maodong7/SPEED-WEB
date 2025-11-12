import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    findById(userId: string): Promise<UserDocument>;
}
