const { selectAllUsers } = require("../models/users.models")

function getAllUsers(req, res, next) {
  selectAllUsers()
  .then((users) =>{
    res.status(200).send({users})
  })
  .catch(next)
}

module.exports = {getAllUsers}