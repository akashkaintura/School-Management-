import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('AWS_SES_SMTP_HOST'),
                    port: parseInt(config.get('AWS_SES_SMTP_PORT') || '587'),
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: config.get('AWS_SES_SMTP_USER'),
                        pass: config.get('AWS_SES_SMTP_PASS'),
                    },
                },
                defaults: {
                    from: `"${config.get('EMAIL_FROM_NAME')}" <${config.get('EMAIL_FROM_ADDRESS')}>`,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
