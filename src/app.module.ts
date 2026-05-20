import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserAccountsModule} from './modules/user-accounts/user-accounts.module';
import {MongooseModule} from '@nestjs/mongoose';
import {TestingModule} from './modules/testing/testing.module';
import {BloggersPlatformModule} from './modules/bloggers-platform/bloggers-platform.module';
import {CoreModule} from './core/core.module';
import {envConfig} from "./config";
import {AuthorizationModule} from "./modules/authorization/authorization.module";
import {NotificationsModule} from "./modules/notifications/notifications.module";

@Module({
    //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    imports: [
        MongooseModule.forRoot(envConfig.mongoURI),
        UserAccountsModule,
        TestingModule,
        BloggersPlatformModule,
        CoreModule,
        AuthorizationModule,
        NotificationsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
