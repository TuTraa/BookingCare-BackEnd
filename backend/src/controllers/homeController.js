import db from "../models/index";
import CRUDservicce from "../services/CRUDservice";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("test/crud.ejs");
};

let postCrud = async (req, res) => {
  let allUsers = await CRUDservicce.createNewUser(req.body);
  return res.render("displayCrud.ejs", { dataTable: allUsers });
};
let displayGetCrud = async (req, res) => {
  let data = await CRUDservicce.getAllUsers();
  return res.render("displayCrud.ejs", { dataTable: data });
};

let getEditCrud = async (req, res) => {
  let userId = req.query.id;
  if (req.query.id) {
    let userData = await CRUDservicce.getUserInforById(userId);
    return res.render("editCrud.ejs", { user: userData });
  } else {
    return res.send("user not fond!");
  }
};

let putCrud = async (req, res) => {
  let allUsers = await CRUDservicce.updateUserData(req.body);
  return res.render("displayCrud.ejs", { dataTable: allUsers });
};

let deleteCrud = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let allUsers = await CRUDservicce.deleteUserById(id);
    return res.render("displayCrud.ejs", { dataTable: allUsers });
  } else {
    return res.send("not fond user!");
  }
};



module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCrud: postCrud,
  displayGetCrud: displayGetCrud,
  getEditCrud: getEditCrud,
  putCrud: putCrud,
  deleteCrud: deleteCrud,
};
