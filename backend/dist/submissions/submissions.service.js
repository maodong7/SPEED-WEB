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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const submission_schema_1 = require("./schemas/submission.schema");
const users_service_1 = require("../users/users.service");
let SubmissionsService = class SubmissionsService {
    submissionModel;
    usersService;
    constructor(submissionModel, usersService) {
        this.submissionModel = submissionModel;
        this.usersService = usersService;
    }
    async reviewSubmission(submissionId, reviewDto, moderatorId) {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) {
            throw new common_1.NotFoundException('文献不存在');
        }
        await this.usersService.findById(moderatorId);
        submission.status = reviewDto.status;
        submission.reviewComment = reviewDto.reviewComment;
        submission.moderatorId = moderatorId;
        submission.reviewTime = new Date();
        return submission.save();
    }
    async findReviewed() {
        return this.submissionModel
            .find({ status: { $in: ['approved', 'rejected'] } })
            .sort({ reviewTime: -1 })
            .exec();
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(submission_schema_1.Submission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map