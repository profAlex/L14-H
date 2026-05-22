import {AuthGuard} from "@nestjs/passport";
import {UnauthorizedException} from "@nestjs/common";

export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, userData, info) {
        // Если стратегия выбросила ошибку или юзер не был найден/пароль не подошел
        if (err || !userData) {
            throw new UnauthorizedException({
                message: 'Wrong login or password', // Твой кастомный текст ошибки
            });
        }

        // обязательно возвращаем userData
        // то, что вернет этот метод, в итоге и запишется в req.user
        return userData;
    }
}