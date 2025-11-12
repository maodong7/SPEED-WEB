import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        status: HttpStatus;
        message: string;
        data: any;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        status: HttpStatus;
        message: string;
        data: any;
    }>;
}
