import userService from "../services/userService";
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;

  if (!email || !pass) {
    return res.status(500).json({
      errCode: 1,
      message: "missing input parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, pass);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : "not fond user",
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //All,SINGLE
  if (!id) {
    return res.status(200).json({
      errCode: 0,
      errMessage: "missing riquired parameters",
    });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "oke",
    users,
  });
};
let handleCreateUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "missing required  parameters ! ",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  }
  catch (e) {
    console.log('get all code err', e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from server'
    })
  }
}
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateUser: handleCreateUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,

};
