import {Module} from "@nestjs/common";
import {MailerModule} from "@nestjs-modules/mailer";
import {envConfig} from "../../config";
import {EmailService} from "./email.service";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: `smtps://${envConfig.mailLogin}:${envConfig.mailPass}@${envConfig.mailHost}`,
            defaults: {
                from: '"test-notification" <geniusb198@yandex.ru>',
                subject: 'Подтверждение регистрации',
            }
        })
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule {}