function handleInvalidEndpoint(req, res){
  res.status(404).send({msg: "Path not found"})
}

function handlePSQLErrors(err, req, res, next) {
  if (err.code === '22P02' || err.code === '23502'){
    res.status(400).send({msg: "Bad request"})
  }
  next(err)
}

function handleCustomErrors(err, req, res, next){
  if(err.status && err.msg){
    res.status(err.status).send({msg: err.msg})
  }
}

function handleServerErrors(err, req, res, next){
  res.status(500).send({msg: "Internal server error!"})
}

module.exports = {handleInvalidEndpoint, handlePSQLErrors, handleCustomErrors, handleServerErrors}