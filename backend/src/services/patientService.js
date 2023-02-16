
import db from "../models/index";
import _ from "lodash"
require('dotenv').config();
import emailService from "./emailService";

let postBookingApointment = (data) => {
    // console.log('data controller==', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                await emailService.sendsimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.examinationtime,
                    doctorName: data.doctorName,
                    redirectLink: "https://www.facebook.com/profile.php?id=100013449603151",
                    language: data.language,
                });
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                    }
                });
                resolve({
                    errCode: 0,
                    errMessage: "save infor patient success!"
                })
                if (user && user[0]) {

                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        }
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookingApointment,
}