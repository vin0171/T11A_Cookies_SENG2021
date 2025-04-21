"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentRequestEmail = sendPaymentRequestEmail;
const validators = __importStar(require("./validationHelpers"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
function sendPaymentRequestEmail(token, emailTo) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const company = yield (0, interfaceHelpers_1.getCompany)(user.companyId);
        const userCompany = company.name;
        const msg = {
            to: emailTo,
            from: 'coinvoices.corp@gmail.com',
            subject: 'Payment Reminder | Deadline: 7 Days',
            text: 'Please pay before the due date to avoid any late fees',
            html: emailTemplate(userCompany, emailTo),
        };
        mail_1.default.send(msg).then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
            .catch((error) => {
            console.error(error);
        });
    });
}
function emailTemplate(senderCompany, receiverEmail) {
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
`;
}
