import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController"

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCrud);
  router.get("/get-crud", homeController.displayGetCrud);
  router.get("/edit-crud", homeController.getEditCrud);
  router.post("/put-crud", homeController.putCrud);
  router.get("/delete-crud", homeController.deleteCrud);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-users", userController.handleCreateUser);
  router.delete("/api/delete-new-users", userController.handleDeleteUser);
  router.put("/api/update-new-users", userController.handleEditUser);

  router.get("/api/allcode", userController.getAllCode);
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);


  router.get("/api/get-all-doctor", doctorController.getAllDoctor);

  router.post("/api/save-infor-doctor", doctorController.saveInforDoctor);
  router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  router.get("/api/get-Schedule-byDate", doctorController.getScheduleByDate);
  //get data detail doctor infor
  router.get("/api/get-extra-inforDoctor-byId", doctorController.getExtraInforDoctorById);
  //profile modal
  router.get("/api/get-profile-doctor-byId", doctorController.getProfileDoctorById);
  //apopointment

  router.post("/api/patient-book-appointment", patientController.postBookingApointment);

  return app.use("/", router);
};
module.exports = initWebRoutes;
