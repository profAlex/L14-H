import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        //can add html templates, implement advertising and other logic for mailing...
        await this.mailerService.sendMail({
            text: `confirm registration via link https://some-front.com/confirm-registration?code=${code}`,
            to: email,
        });
    }

    async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
        await this.mailerService.sendMail({
            text: `proceed to password recovery via link https://some-front.com/confirm-registration?code=${recoveryCode}`,
            to: email,
        });
    }
}