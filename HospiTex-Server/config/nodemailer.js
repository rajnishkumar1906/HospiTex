import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : false,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PWD
    }
})