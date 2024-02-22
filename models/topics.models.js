const db = require("../db/connection")

function selectAllTopics() {
  return db.query('SELECT * FROM topics;')
  .then((result) => {
    return result.rows;
  })
}

function selectTopicByName(topic) {
  return db.query('SELECT * FROM topics WHERE slug = $1;', [topic])
  .then((result) => {
    if(result.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "topic does not exist"})
      }
    return result.rows
  })
}

module.exports = {selectAllTopics , selectTopicByName}
