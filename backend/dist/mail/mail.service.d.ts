import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from '../users/interface/user.interface';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendResetPasswordLink(user: IUser, token: string, origin: string): Promise<void>;
}
