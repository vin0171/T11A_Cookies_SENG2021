import * as validators from './validationHelpers';
import sgMail from '@sendgrid/mail'
import { getCompany } from './interfaceHelpers';

import dotenv from 'dotenv';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendPaymentRequestEmail(token: string, emailTo: string) {
    const user = await validators.validateToken(token);
    const company = await getCompany(user.companyId);
    const userCompany = company.name;

    const msg = {
        to: emailTo, 
        from: 'coinvoices.corp@gmail.com', 
        subject: 'Payment Reminder | Deadline: 7 Days',
        text: 'Please pay before the due date to avoid any late fees',
        html: emailTemplate(userCompany, emailTo),
    }

    sgMail.send(msg).then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    })
    .catch((error) => {
        console.error(error)
    })
}


function emailTemplate(senderCompany: string, receiverEmail: string) {
    return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr>
        <td style="padding: 30px; text-align: center;">
          <h2 style="margin: 0; color: #333;">Payment Confirmation</h2>
          <p style="margin: 5px 0 20px; color: #777;">Invoice #123456 • April 18, 2025</p>
        </td>
      </tr>

      <!-- TO / FROM -->
      <tr>
        <td style="padding: 0 30px 20px;">
          <table width="100%" style="font-size: 14px; color: #555;">
            <tr>
              <td style="padding-bottom: 8px;"><strong>To:</strong> John Doe<br>${receiverEmail}</td>
              <td style="padding-bottom: 8px;" align="right"><strong>From:</strong> ${senderCompany}<br> </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Product Table -->
      <tr>
        <td style="padding: 0 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Product A</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;" align="right">$50.00</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Product B</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;" align="right">$25.00</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Total</td>
              <td style="padding: 10px 0; font-weight: bold;" align="right">$75.00</td>
            </tr>
          </table>

          <!-- Bigger Pay Now Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://your-payment-link.com" target="_blank"
               style="background-color: #007BFF; color: #ffffff; padding: 18px 36px; font-size: 18px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
              Pay Now
            </a>
          </div>

          <p style="color: #555; text-align: center;">Thank you for your purchase! If you have any questions, feel free to contact us.</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          © 2025 ${senderCompany}, All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

