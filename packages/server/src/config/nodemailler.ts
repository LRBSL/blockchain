var nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rstmpgd1@gmail.com',
        pass: 'sachintha96'
    }
});