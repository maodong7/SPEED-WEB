import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddCollectionDto, RemoveCollectionDto } from './dto/collection.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    addCollection(dto: AddCollectionDto, req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: import("./schemas/user.schema").User;
    }>;
    removeCollection(dto: RemoveCollectionDto, req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: import("./schemas/user.schema").User;
    }>;
    getCollections(req: any): Promise<{
        status: HttpStatus;
        data: import("../submissions/schemas/submission.schema").Submission[];
    }>;
    getProfile(req: any): Promise<{
        status: HttpStatus;
        data: any;
    }>;
}
