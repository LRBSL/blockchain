import { identity_config } from '../config';
const mailjet = require('node-mailjet').connect('3ab1e3691848bfb3466b1f7a6fe75b87', '944ca733590e72e0962d0b10c3cabe37');

export function checkBodyParams(params: any) {
    let isValid: boolean = true;
    params.forEach(param => {
        if (param == null || param == undefined) {
            isValid = false;
        }
    });
    // return isValid;
    if (!isValid) {
        throw new Error('Mandotary requst parameters not found. Check request body again.');
    }
}

export function checkAdminPriviledges() {
    if (identity_config.identityName != 'user1') {
        throw new Error("User has no privilages to execute this action");
    }
}

export function sendMail(toEmail: string, subject: string, content: string) {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "rstmpgd1@gmail.com",
                        "Name": "LRBSL System"
                    },
                    "To": [
                        {
                            "Email": toEmail,
                            "Name": "Ravindu Sachintha"
                        }
                    ],
                    "Subject": subject,
                    "TextPart": content,
                    "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
            console.log(err)
        })
}