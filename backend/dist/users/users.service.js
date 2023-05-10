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
const bcrypt = require("bcrypt");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("mongoose");
const shared_pagination_1 = require("../utils/shared-pagination");
const token_service_1 = require("../token/token.service");
let UsersService = class UsersService {
    constructor(userModel, tokenService) {
        this.userModel = userModel;
        this.tokenService = tokenService;
        this.ObjectId = mongoose_2.default.Types.ObjectId;
    }
    async create(newUser, query) {
        var _a;
        try {
            newUser.password = bcrypt.hashSync(newUser.password, 8);
            const createdUser = new this.userModel(newUser);
            await createdUser.save();
            const filters = {
                pageIndex: "0",
                pageSize: ((_a = query === null || query === void 0 ? void 0 : query.pageSize) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
            };
            return await (0, shared_pagination_1.getPagination)(this.userModel, filters);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(query) {
        return await (0, shared_pagination_1.getPagination)(this.userModel, query);
    }
    async findOne(query) {
        try {
            const user = await this.userModel.findOne(query);
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async findOneNoPass(query) {
        try {
            const user = await this.userModel.findOne(query).select("-password");
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async findUserPassword(query) {
        try {
            const user = await this.userModel.findOne(query).select("password");
            return user.password;
        }
        catch (error) {
            return null;
        }
    }
    async update(userId, user) {
        try {
            await this.userModel.updateOne({ _id: new this.ObjectId(`${userId}`) }, user);
            return { message: `Userul cu id-ul ${userId} a fost actualizat` };
        }
        catch (error) {
            return null;
        }
    }
    async toogleUserStatus(userId, user, query) {
        try {
            await this.userModel.updateOne({ _id: new this.ObjectId(`${userId}`) }, user);
            if (!user.isActivated) {
                await this.tokenService.update(userId, null, "refresh");
            }
            return await (0, shared_pagination_1.getPagination)(this.userModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async updateUser(userId, user, query) {
        try {
            await this.userModel.updateOne({ _id: new this.ObjectId(`${userId}`) }, user);
            if (!user.isActivated) {
                await this.tokenService.update(userId, null, "refresh");
            }
            return await (0, shared_pagination_1.getPagination)(this.userModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async updatePassword(userId, password, query) {
        const duplicate = await this.checkOldPassword(userId, password);
        if (duplicate) {
            throw new common_1.BadRequestException("Parola noua nu poate fi identica cu cea veche");
        }
        try {
            const newPass = bcrypt.hashSync(password, 8);
            await this.userModel.updateOne({ _id: new this.ObjectId(`${userId}`) }, { password: newPass });
            return await (0, shared_pagination_1.getPagination)(this.userModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async updateOwnPassword(userId, password) {
        const duplicate = await this.checkOldPassword(userId, password);
        if (duplicate) {
            throw new common_1.BadRequestException("Parola noua nu poate fi identica cu cea veche");
        }
        try {
            const newPass = bcrypt.hashSync(password, 8);
            await this.userModel.updateOne({ _id: new this.ObjectId(`${userId}`) }, { password: newPass });
            return { message: "Parola a fost modificata cu succes" };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(userId, query) {
        try {
            await this.userModel.deleteOne({ _id: new this.ObjectId(`${userId}`) });
            return await (0, shared_pagination_1.getPagination)(this.userModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async checkOldPassword(userId, password) {
        try {
            const oldPassword = await this.findUserPassword({
                _id: new this.ObjectId(`${userId}`),
            });
            const passwordValid = bcrypt.compareSync(password, oldPassword);
            return passwordValid;
        }
        catch (error) {
            return null;
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        token_service_1.TokenService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map