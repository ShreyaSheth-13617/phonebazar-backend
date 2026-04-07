const mailer = require("nodemailer")
require("dotenv").config()

const mailSend = async (to, subject, htmlContent) => {
    try {

        const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: htmlContent
        }

        const mailResponse = await transporter.sendMail(mailOptions)

        console.log("Mail sent successfully to:", to)
        return mailResponse

    } catch (error) {
        console.log("Mail send failed:", error.message)
        // Do not throw error; email failures should not break app flow
    }
}

const sendWelcomeEmail = async (userEmail, userName) => {
    const subject = "Welcome to PhoneBazar! 🎉"
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to PhoneBazar</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #eab308;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content h2 {
                    color: #eab308;
                    margin-bottom: 20px;
                }
                .content p {
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #eab308;
                    color: #000000;
                    font-weight: 600;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PhoneBazar</h1>
                </div>
                <div class="content">
                    <h2>Welcome, ${userName}!</h2>
                    <p>Thank you for joining PhoneBazar, your go-to marketplace for buying and selling phones.</p>
                    <p>Start exploring our wide range of phones, connect with sellers, and find the perfect device for you.</p>
                    <a href="http://localhost:3000" class="button">Explore Now</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PhoneBazar. All rights reserved.</p>
                    <p>If you have any questions, contact us at support@phonebazar.com</p>
                </div>
            </div>
        </body>
        </html>
    `
    return await mailSend(userEmail, subject, htmlContent)
}

const sendLoginNotification = async (userEmail, userName) => {
    const subject = "PhoneBazar — Sign-in Notification"
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign-in Notification</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #eab308;
                    color: #000000;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content p {
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PhoneBazar</h1>
                </div>
                <div class="content">
                    <p>Hi ${userName},</p>
                    <p>You just signed in to your PhoneBazar account.</p>
                    <p>If this wasn't you, please secure your account immediately.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PhoneBazar. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `
    return await mailSend(userEmail, subject, htmlContent)
}

const sendForgotPasswordEmail = async (userEmail, userName, resetUrl) => {
    const subject = "PhoneBazar — Password Reset Request"
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #eab308;
                    color: #000000;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    background-color: #eab308;
                    color: #000000;
                    font-weight: 600;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PhoneBazar</h1>
                </div>
                <div class="content">
                    <p>Hi ${userName},</p>
                    <p>You requested a password reset for your PhoneBazar account.</p>
                    <p>Click the button below to reset your password. This link is valid for 10 minutes.</p>
                    <a href="${resetUrl}" class="button">Reset Password</a>
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">If you didn't request this, you can ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PhoneBazar. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `
    return await mailSend(userEmail, subject, htmlContent)
}

module.exports = {
    mailSend,
    sendWelcomeEmail,
    sendLoginNotification,
    sendForgotPasswordEmail
}