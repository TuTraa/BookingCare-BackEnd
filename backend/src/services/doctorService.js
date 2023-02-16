import db from "../models/index";
import _ from "lodash"
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = limit => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true

            })
            resolve({
                errCode: 0,
                data: users,
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllDoctorSevice = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    })
}
let saveInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                else {

                    if (inputData.action === 'EDIT') {
                        let doctorMarkdown = await db.Markdown.findOne({
                            where: {
                                doctorId: inputData.doctorId
                            },
                            raw: false,
                        })
                        if (doctorMarkdown) {
                            doctorMarkdown.contentHTML = inputData.contentHTML;
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                            doctorMarkdown.description = inputData.description;
                            doctorMarkdown.updateAt = new Date();
                            await doctorMarkdown.save();
                        }
                    }

                }
                let isDoctorInfor = await db.doctorinfor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false,
                })
                if (isDoctorInfor) {
                    isDoctorInfor.doctorId = inputData.doctorId;
                    isDoctorInfor.priceId = inputData.selectedPrice;
                    isDoctorInfor.paymentId = inputData.selectedPayment;
                    isDoctorInfor.provinceId = inputData.selectedProvince;
                    isDoctorInfor.nameClinic = inputData.nameClinic;
                    isDoctorInfor.addressClinic = inputData.adressClinic;
                    isDoctorInfor.note = inputData.note;
                    await isDoctorInfor.save();
                }
                else {
                    await db.doctorinfor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.adressClinic,
                        note: inputData.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'save infor doctor succeed',
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: {
                    id: inputId,
                },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: db.Markdown,
                    attributes: ['description', 'contentHTML', 'contentMarkdown']
                },
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                {
                    model: db.doctorinfor,
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'ProvinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ]
                }
                ],
                raw: false,
                nest: true,
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if (!data) {
                data = {};
            }
            resolve({
                errCode: 0,
                data: data
            })

        }
        catch (e) {
            reject(e);
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required param!',
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {

                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // console.log('data service:', schedule);


                //convert date
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                });
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                // console.log('shedule', schedule, 'exis', existing)
                //compare differnt
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'oke'
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing requied parameter'
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: {
                        date: date,
                        doctorId: doctorId,
                    }
                    ,
                    include: [{
                        model: db.Allcode,
                        as: 'timeTypeData',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (!data) { data = [] }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {

        }
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing requied parameter'
                })
            }
            else {
                let data = await db.doctorinfor.findOne({
                    where: {
                        doctorId: doctorId,
                    }
                    ,
                    include: [{
                        model: db.Allcode,
                        as: 'priceTypeData',
                        attributes: ['valueVi', 'valueEn']
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (!data) { data = [] }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {

        }
    })
}
//profile modal
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [{
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.doctorinfor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'ProvinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    }
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorSevice: getAllDoctorSevice,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
}