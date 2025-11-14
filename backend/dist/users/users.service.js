"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const submission_schema_1 = require("../submissions/schemas/submission.schema");
let UsersService = class UsersService {
    userModel;
    submissionModel;
    jwtService;
    constructor(userModel, submissionModel, jwtService) {
        this.userModel = userModel;
        this.submissionModel = submissionModel;
        this.jwtService = jwtService;
    }
    async addCollection(userId, dto) {
        const submission = await this.submissionModel.findById(dto.submissionId);
        if (!submission) {
            throw new common_1.NotFoundException('文献不存在');
        }
        const user = await this.userModel.findById(userId);
        if (user.collections.includes(dto.submissionId)) {
            throw new common_1.ConflictException('已收藏该文献');
        }
        user.collections.push(dto.submissionId);
        return user.save();
    }
    async removeCollection(userId, dto) {
        const user = await this.userModel.findById(userId);
        if (!user.collections.includes(dto.submissionId)) {
            throw new common_1.NotFoundException('未收藏该文献');
        }
        user.collections = user.collections.filter(id => id !== dto.submissionId);
        return user.save();
    }
    async getCollections(userId) {
        const user = await this.userModel.findById(userId);
        return this.submissionModel.find({ _id: { $in: user.collections } }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(submission_schema_1.Submission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map