import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {UsersQueryRepository} from "../../user-accounts/infrastructure/query/users.query-repository";
import {CryptoService} from "../../../core/bcrypt/bcrypt.service";
import {JwtService} from "@nestjs/jwt";
import {RegisterNewUserDto} from "../api/input-dto/register-new-user.input-dto";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserModelType} from "../../user-accounts/domain/user.entity";
import {UsersRepository} from "../../user-accounts/infrastructure/users.repository";
import {EmailService} from "../../notifications/email.service";
import {UUIDGeneratorUtil} from "../../../core/uuid-generation/uuid.service";

@Injectable()
export class AuthService {
    constructor(private usersQueryRepository: UsersQueryRepository,
                private usersCommandRepository: UsersRepository,
                private cryptoService: CryptoService,
                private jwtService: JwtService,
                private emailService: EmailService,
                @InjectModel(User.name) private UserModel: UserModelType,) {
        console.log('AuthService created');
    }

    async validateUserCreds(loginOrEmail: string, password: string): Promise<UserContextDto | null> {
        const user = await this.usersQueryRepository.findUserByLogin(loginOrEmail);
        if (!user) {
            return null;
        }

        if (!user.isEmailConfirmed) {
            return null;
        }

        const isPasswordValid = await this.cryptoService.checkPassword(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return null;
        }

        return {id: user.id};
    };

    async loginUser(userId: string): Promise<{ accessToken: string }> {
        const accessToken = await this.jwtService.signAsync({id: userId} as UserContextDto);

        return {accessToken: accessToken};
    };

    async registerAttempt(sentLogin: string, sentPassword: string, sentEmail: string): Promise<void> {
        const checkIfUserCredsAvaliable = await this.usersQueryRepository.checkIfUserExists(sentLogin, sentEmail);

        if (checkIfUserCredsAvaliable) {
            throw new BadRequestException();
        }

        const passwordHash = await this.cryptoService.generateHash(sentPassword);
        if (!passwordHash) {
            throw new InternalServerErrorException("Couldn't generate hash");
        }
        const confirmationCode = UUIDGeneratorUtil.generateUUID();

        const newUser = this.UserModel.createInstance({
            login: sentLogin,
            email: sentEmail,
            passwordHash: passwordHash,
            confirmationCode: confirmationCode
        });
        await this.usersCommandRepository.save(newUser);

        await this.emailService.sendConfirmationEmail(sentEmail, confirmationCode);

        return;
    }
}