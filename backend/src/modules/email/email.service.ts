import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) { }

  async sendInvitationEmail(
    email: string,
    invitationToken: string,
    schoolName: string,
    role: string,
  ) {
    const invitationLink = `${this.configService.get('FRONTEND_URL')}/login?token=${invitationToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You're invited to join ${schoolName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .code-box { background: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all; color: #4F46E5; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Welcome to ${schoolName}!</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>You've been invited to join <strong>${schoolName}</strong> as a <strong>${role}</strong>.</p>
                <p>Click the button below to accept your invitation and set up your account:</p>
                <p style="text-align: center;">
                  <a href="${invitationLink}" class="button">Accept Invitation</a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <div class="code-box">${invitationLink}</div>
                <p><strong>⏰ This invitation will expire in 7 days.</strong></p>
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2025 School Management System. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`✅ Invitation email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send invitation email:', error);
      // Don't throw error - we don't want invitation creation to fail if email fails
      // In production, you might want to queue this for retry
    }
  }

  async sendInvitationRequiredEmail(email: string) {
    const supportEmail = this.configService.get('EMAIL_FROM_ADDRESS');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Invitation Required - School Management System',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 Invitation Required</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We noticed you tried to sign up for our School Management System using <strong>${email}</strong>.</p>
                
                <div class="info-box">
                  <strong>⚠️ Access Restricted</strong><br/>
                  Our platform is invitation-only. You must be invited by a school administrator to create an account.
                </div>

                <p><strong>How to get access:</strong></p>
                <ol>
                  <li>Contact your school administrator</li>
                  <li>Ask them to send you an invitation</li>
                  <li>Check your email for the invitation link</li>
                  <li>Click the link and sign in with Google</li>
                </ol>

                <p style="margin-top: 30px;">If you believe this is an error or need assistance, please contact us at:</p>
                <p style="text-align: center; font-size: 16px;">
                  <strong>${supportEmail}</strong>
                </p>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
                  This is an automated message. Please do not reply to this email.
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2025 School Management System. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`✅ Invitation required email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send invitation required email:', error);
      // Don't throw - this is just a courtesy email
    }
  }
}
