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
exports.SubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const submissions_service_1 = require("./submissions.service");
const review_submission_dto_1 = require("./dto/review-submission.dto");
let SubmissionsController = class SubmissionsController {
    submissionsService;
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async reviewSubmission(submissionId, reviewDto, req) {
        if (!req.user) {
            throw new UnauthorizedException('请先登录');
        }
        return {
            status: common_1.HttpStatus.OK,
            message: '审核成功',
            data: await this.submissionsService.reviewSubmission(submissionId, reviewDto, req.user.userId),
        };
    }
    async findReviewed() {
        return {
            status: common_1.HttpStatus.OK,
            data: await this.submissionsService.findReviewed(),
        };
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Post)(':id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_submission_dto_1.ReviewSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "reviewSubmission", null);
__decorate([
    (0, common_1.Get)('reviewed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubmissionsController.prototype, "findReviewed", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_1.Controller)('api/submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], SubmissionsController);
//# sourceMappingURL=submissions.controller.js.map