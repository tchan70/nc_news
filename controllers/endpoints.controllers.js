const { selectAllEndpoints } = require("../models/endpoints.models")

function getAllEndpoints(req, res, next){
  const endpoints = selectAllEndpoints()
  res.status(200).send(endpoints)
}

module.exports = {getAllEndpoints}