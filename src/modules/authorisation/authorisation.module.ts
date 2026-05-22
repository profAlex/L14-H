import {Module} from "@nestjs/common";
import {AuthController} from "./api/auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {envConfig} from "../../config";
import {NotificationsModule} from "../notifications/notifications.module";
import {UserAccountsModule} from "../user-accounts/user-accounts.module";
import {CryptoService} from "../../core/bcrypt/bcrypt.service";
import {AuthService} from "./application/auth.service";
import {LocalStrategy} from "./guards/local/local.strategy";
import {SecurityDevicesController} from "./api/security-devices.controller";
import {AuthQueryRepository} from "../user-accounts/infrastructure/query/auth.query-repository";
import {JwtStrategy} from "./guards/bearer/jwt.strategy";
import {BasicStrategy} from "passport-http";

@Module({
    imports: [JwtModule.register({
        secret: envConfig.accessTokenSecret,
        signOptions: {expiresIn: '60m'}
    }),
        NotificationsModule,
        UserAccountsModule
    ],
    controllers: [AuthController, SecurityDevicesController],
    providers: [AuthService,
        AuthQueryRepository,
        // SecurityDevicesQueryRepository,
        LocalStrategy, // Паспортная стратегия для логина
        JwtStrategy,   // Паспортная стратегия для гвардов
        BasicStrategy,
        CryptoService
    ],
    exports: [],
})

export class AuthorisationModule {
}