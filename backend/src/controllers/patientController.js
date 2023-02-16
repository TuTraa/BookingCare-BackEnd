
import patientService from "../services/patientService"

let postBookingApointment = async (req, res) => {
    try {
        console.log('patient', req.body)
        let data = await patientService.postBookingApointment(req.body);
        return res.status(200).json(
            data
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'error from the sever'
        })
    }
}
module.exports = {
    postBookingApointment: postBookingApointment,
}