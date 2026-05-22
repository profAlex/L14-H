import {Injectable} from "@nestjs/common";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {UsersQueryRepository} from "../../user-accounts/infrastructure/query/users.query-repository";
import {CryptoService} from "../../../core/bcrypt/bcrypt.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private usersQueryRepository: UsersQueryRepository,
                private cryptoService: CryptoService,
                private jwtService: JwtService,) {
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
    }

    async loginUser(userId: string): Promise<{ accessToken: string }> {
        const accessToken = await this.jwtService.signAsync({id: userId} as UserContextDto);

        return {accessToken: accessToken};
    }
}