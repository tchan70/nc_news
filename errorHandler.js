function pathNotFound(req, res, next){
  res.status(404).send({msg: "Path not found"})
}

function errorHandling(err, req, res, next) {
  if(err.status && err.msg){
    res.status(err.status).send({msg: err.msg})
  } 
  else {
    res.status(500).send({msg: "Internal server error!"})
  }
}

module.exports = {pathNotFound, errorHandling}