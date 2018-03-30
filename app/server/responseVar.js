module.exports = responseVar;

function responseVar(response="setResponse",statusCode=400,type="setType"){
  this.response = response;
  this.statusCode = statusCode;
  this.type = type;
}
