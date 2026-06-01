import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...
        await this.mailerService.sendMail({
            subject: `finish registration`,
            to: email,
            html: `<h1>Registration completion</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>complete registration</a>
        </p>`,
        });
    }

    // async sendConfirmationEmail(email: string, code: string): Promise<void> {
    //     try {
    //         await this.mailerService.sendMail({
    //             text: `confirm registration via link https://some-front.com/confirm-registration?code=${code}`,
    //             to: email,
    //         });
    //         console.log("=== ПИСЬМО УСПЕШНО ОТПРАВЛЕНО ===");
    //     } catch (error) {
    //         console.error("!!! ОШИБКА ОТПРАВКИ ПОЧТЫ !!!");
    //         console.error(error); // Здесь будет детальный лог от Яндекса
    //     }
    // }

    async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
        await this.mailerService.sendMail({
            subject: `password recovery`,
            to: email,
            html: `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
        </p>`
        });
    }
}