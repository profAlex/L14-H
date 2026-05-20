import {AuthGuard} from "@nestjs/passport";
import {UnauthorizedException} from "@nestjs/common";

export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, user, info) {
        // Если стратегия выбросила ошибку или юзер не был найден/пароль не подошел
        if (err || !user) {
            throw new UnauthorizedException({
                message: 'Wrong login or password', // Твой кастомный текст ошибки
            });
        }

        // Обязательно возвращаем юзера!
        // То, что вернет этот метод, в итоге и запишется в req.user
        return user;
    }
}