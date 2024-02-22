const db = require("../db/connection")

function selectUserByUsername(username) {
  return db.query('SELECT * FROM users WHERE username = $1;', [username])
  .then((result) => {
    if(result.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "username does not exist"})
      }
    return result.rows[0];
  })
}

module.exports = {selectUserByUsername}