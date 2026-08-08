import dotenv from "dotenv";
import { EmailClient } from "@azure/communication-email";

dotenv.config();

const client = new EmailClient(
    process.env.AZURE_COMMUNICATION_CONNECTION_STRING
);

async function sendOTP(email, otp) {
    try {

        const emailMessage = {
            senderAddress: "donotreply@d74c3e96-405a-4314-bb7f-239112383a34.azurecomm.net",

            content: {
                subject: "Verify Your Email | Orbital",

                plainText: `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,

                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>

                <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

                    <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
                        <tr>
                            <td align="center">

                                <table width="600" cellspacing="0" cellpadding="0"
                                    style="
                                    background:#ffffff;
                                    border-radius:12px;
                                    overflow:hidden;
                                    box-shadow:0 8px 30px rgba(0,0,0,.08);
                                    ">

                                    <!-- Header -->
                                    <tr>
                                        <td
                                            style="
                                            background:#2563eb;
                                            color:#ffffff;
                                            text-align:center;
                                            padding:30px;
                                            ">

                                            <h1 style="margin:0;font-size:30px;">
                                                🚀 Orbital
                                            </h1>

                                            <p style="margin-top:10px;font-size:15px;">
                                                Secure Email Verification
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:40px;">

                                            <h2 style="margin-top:0;color:#222;">
                                                Verify Your Email
                                            </h2>

                                            <p style="color:#555;font-size:16px;line-height:1.8;">
                                                Welcome to <strong>Orbital</strong>!
                                                Use the One-Time Password (OTP)
                                                below to verify your email address.
                                            </p>

                                            <!-- OTP BOX -->
                                            <div
                                                style="
                                                width:260px;
                                                margin:35px auto;
                                                background:#2563eb;
                                                color:#ffffff;
                                                text-align:center;
                                                padding:18px;
                                                border-radius:10px;
                                                font-size:36px;
                                                font-weight:bold;
                                                letter-spacing:8px;
                                                ">
                                                ${otp}
                                            </div>

                                            <p
                                                style="
                                                color:#666;
                                                text-align:center;
                                                font-size:15px;
                                                ">
                                                This OTP is valid for
                                                <strong>5 minutes</strong>.
                                            </p>

                                            <hr
                                                style="
                                                margin:35px 0;
                                                border:none;
                                                border-top:1px solid #e5e7eb;
                                                ">

                                            <p
                                                style="
                                                color:#777;
                                                font-size:14px;
                                                line-height:1.8;
                                                ">
                                                If you didn't request this verification,
                                                please ignore this email.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td
                                            style="
                                            background:#f8fafc;
                                            text-align:center;
                                            padding:25px;
                                            color:#888;
                                            font-size:13px;
                                            ">

                                            © 2026 Orbital

                                            <br><br>

                                            This is an automated email.
                                            Please do not reply.

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
                `,
            },

            recipients: {
                to: [
                    {
                        address: email,
                    },
                ],
            },
        };

        console.log(" Sending Email...");

        const poller = await client.beginSend(emailMessage);

        const result = await poller.pollUntilDone();

        console.log("Email sent successfully!");
        console.log(result);

        return result;

    } catch (err) {
        console.error("Failed to send email");
        console.error(err);

        throw err;
    }
}

export { sendOTP };