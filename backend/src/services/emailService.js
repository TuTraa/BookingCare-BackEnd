require('dotenv').config();
import nodemailer from "nodemailer";

let sendsimpleEmail = async (dataSend) => {
    // console.log('datasend:', dataSend)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCare 👻" <a01235935558@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });


}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào ${dataSend.patientName}! </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare </p>
        <p>thông tin đặt lịch khám bệnh </p>
        <div> <b>Thời gian: ${dataSend.time} </b> </div>
        <div> <b>Bác sĩ: ${dataSend.doctorName} </b> </div>
        <p>Vui lòng click vào đường link bên dưới để xác nhận! </p>
        <div> <a href="${dataSend.redirectLink}" target="_blank">click here </a> </div>
        <div>Xin chân thành cảm ơn! </div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}! </h3>
        <p>You received this email because you booked an online medical appointment on BookingCare </p>
        <p>medical appointment booking information </p>
        <div> <b>Time: ${dataSend.time} </b> </div>
        <div> <b>Doctor: ${dataSend.doctorName} </b> </div>
        <p>Please click the link below to confirm! </p>
        <div> <a href="${dataSend.redirectLink}" target="_blank">click here </a> </div>
        <div>Sincerely thank! </div>
        `
    }
    return result;
}
// async..await is not allowed in global scope, must use a wrapper
// async function main() {

//     let testAccount = await nodemailer.createTestAccount();


// }

module.exports = {
    sendsimpleEmail: sendsimpleEmail,
}