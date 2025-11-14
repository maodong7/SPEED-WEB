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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const collection_dto_1 = require("./dto/collection.dto");
const auth_middleware_1 = require("../middleware/auth.middleware");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async addCollection(dto, req) {
        return {
            status: common_1.HttpStatus.OK,
            message: '收藏成功',
            data: await this.usersService.addCollection(req.user.userId, dto),
        };
    }
    async removeCollection(dto, req) {
        return {
            status: common_1.HttpStatus.OK,
            message: '取消收藏成功',
            data: await this.usersService.removeCollection(req.user.userId, dto),
        };
    }
    async getCollections(req) {
        return {
            status: common_1.HttpStatus.OK,
            data: await this.usersService.getCollections(req.user.userId),
        };
    }
    async getProfile(req) {
        const user = await this.usersService.findById(req.user.userId);
        const { password, ...userInfo } = user.toObject();
        return {
            status: common_1.HttpStatus.OK,
            data: userInfo,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseMiddleware)(auth_middleware_1.AuthMiddleware),
    (0, common_1.Post)('collection/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_dto_1.AddCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addCollection", null);
__decorate([
    (0, common_1.UseMiddleware)(auth_middleware_1.AuthMiddleware),
    (0, common_1.Post)('collection/remove'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_dto_1.RemoveCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeCollection", null);
__decorate([
    (0, common_1.UseMiddleware)(auth_middleware_1.AuthMiddleware),
    (0, common_1.Get)('collections'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCollections", null);
__decorate([
    (0, common_1.UseMiddleware)(auth_middleware_1.AuthMiddleware),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map