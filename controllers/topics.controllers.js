const { selectAllTopics, selectAllEndpoints } = require("../models/topics.models")

function getAllTopics(req, res, next){
  selectAllTopics()
  .then((topics) =>{
    res.status(200).send({topics})
  })
  .catch(next)
}

module.exports = {getAllTopics}