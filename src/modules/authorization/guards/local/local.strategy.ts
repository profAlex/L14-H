import {Strategy} from "passport-local";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({usernameField: 'loginOrEmail'});
    };

    //validate возвращает то, что впоследствии будет записано в req.user
    async validate(loginOrEmail: string, password: string): Promise<any> {
        const user = await this.authService.validateUserCreds(loginOrEmail, password);
        // этот конкретный гвард написан только для классического HTTP-контроллера, пожтому мучиться с кастомными обработчиками ошибок нет смысла
        if (!user) {
            throw new UnauthorizedException({
                message: 'Wrong login or password', // Твой кастомный текст ошибки
            });
        }

        return user;
    }
}