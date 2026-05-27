import {User, UserModelType} from '../../domain/user.entity';
import {InjectModel} from '@nestjs/mongoose';
import {UserViewDto} from '../../api/view-dto/users.view-dto';
import {Injectable, NotFoundException} from '@nestjs/common';

import {FilterQuery} from 'mongoose';
import {PaginatedViewDto} from '../../../../core/dto/base.paginated.view-dto';
import {GetUsersQueryParams} from '../../api/input-dto/get-users-query-params.input-dto';
import {UserAuthInternalDto} from "../../../authorisation/dto/internal-dto/users.auth-internal-dto";

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
    ) {
    }

    async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return UserViewDto.mapToView(user);
    };

    async getAll(
        query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto>> {
        const filter: FilterQuery<User> = {
            deletedAt: null,
        };

        if (query.searchLoginTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                login: {$regex: query.searchLoginTerm, $options: 'i'},
            });
        }

        if (query.searchEmailTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                email: {$regex: query.searchEmailTerm, $options: 'i'},
            });
        }

        const users = await this.UserModel.find(filter)
            .sort({[query.sortBy]: query.sortDirection})
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const totalCount = await this.UserModel.countDocuments(filter);

        const items = users.map(UserViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    };


    async findUserByLogin(loginOrEmail: string): Promise<UserAuthInternalDto | null> {
        const user = await this.UserModel.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ],
            $and: [{deletedAt: null}]
        })
            .select('_id email passwordHash login isEmailConfirmed deletedAt name')
            .lean();

        
        if (!user) {
            return null;
        }

        return UserAuthInternalDto.mapToView(user);
    };


    async checkIfUserExists(login: string, email: string): Promise<boolean> {
        return (await this.UserModel.countDocuments({
            $or:[
                {login: login},
                {email: email}
            ],
            $and: [{deletedAt: null}]
        }) > 0)
    }
}
