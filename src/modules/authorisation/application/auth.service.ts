import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {CryptoService} from "../../../core/bcrypt/bcrypt.service";
import {JwtService} from "@nestjs/jwt";
import {EmailService} from "../../notifications/email.service";
import {UsersService} from "../../user-accounts/application/users.service";
import {UUIDGeneratorUtil} from "../../../core/uuid-generation/uuid.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private cryptoService: CryptoService,
                private jwtService: JwtService,
                private emailService: EmailService) {
        console.log('AuthService created');
    }

    async validateUserCreds(loginOrEmail: string, password: string): Promise<UserContextDto | null> {
        const user = await this.usersService.findUserByLogin(loginOrEmail);
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
        const checkIfUserCredsAvaliable = await this.usersService.checkIfUserExists(sentLogin, sentEmail);

        if (checkIfUserCredsAvaliable) {
            throw new BadRequestException();
        }

        const newUserId = await this.usersService.createUser({
            login: sentLogin,
            email: sentEmail,
            password: sentPassword
        });

        const user = await this.usersService.findOrNotFoundFail(newUserId);

        // const passwordHash = await this.cryptoService.generateHash(sentPassword);
        // if (!passwordHash) {
        //     throw new InternalServerErrorException("Couldn't generate hash");
        // }
        // const confirmationCode = UUIDGeneratorUtil.generateUUID();
        //
        // const newUser = this.UserModel.createInstance({
        //     login: sentLogin,
        //     email: sentEmail,
        //     passwordHash: passwordHash,
        //     confirmationCode: confirmationCode
        // });
        // await this.usersCommandRepository.save(newUser);

        if(!user.emailConfirmationInfo.confirmationCode){
            throw new BadRequestException("Email confirmation code was not generated!");
        }

        await this.emailService.sendConfirmationEmail(sentEmail, user.emailConfirmationInfo.confirmationCode);
    };

    async confirmRegistration(sentCode: string): Promise<void> {
        const userToBeConfirmed = await this.usersService.findUserByConfirmationCode(sentCode);

        if (!userToBeConfirmed) {
            throw new BadRequestException("Email confirmation is wrong, outdated or not found.");
        }

        userToBeConfirmed.confirmEmail();

        await this.usersService.saveUser(userToBeConfirmed);
    };


    async passwordRecoveryByEmail(sentEmail: string): Promise<void> {
        const user = await this.usersService.findConfirmedUserByEmail(sentEmail);
        if (!user) {
            // Returning "success". Even if current email is not registered (for prevent user's email detection)
            return;
        }

        //TODO: следующие три строчки можно вынести и в отдельный метод внутри схемы юзера
        const recoveryCode = UUIDGeneratorUtil.generateUUID();

        user.recoveryCode = recoveryCode;
        user.recoveryCodeExpirationDate = new Date(
            new Date().setMinutes(new Date().getMinutes() + 30)); //TODO: 30 вынести в environment переменную

        await this.usersService.saveUser(user);

        await this.emailService.sendRecoveryEmail(sentEmail, recoveryCode);
    }

}