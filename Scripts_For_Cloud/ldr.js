var request = require('request');
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

//socket.on('connect', function(){});
const LIGHT_THRESHOLD = 1000;


setInterval(()=>{
  request({
    headers : {'content-type' : 'application/x-www-form-urlencoded'},
    url : 'http://192.168.43.57:5005/getLDR',
    method : 'GET',
  },(err,res,body)=>{

    try{

      body = JSON.parse(body);
      console.log(body);
      console.log(body.response);
      if(body.response < LIGHT_THRESHOLD){
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"LDR"},{$set:{lightThreshold:false}},function(err,res){
            if(err) throw err;
            console.log("LIGHT_THRESHOLD : FALSE");
          })
        })
      }
      else {
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"LDR"},{$set:{lightThreshold:true}},function(err,res){
            if(err) throw err;
            console.log("LIGHT_THRESHOLD : TRUE");
          })
        })
      }

    }catch(e)
    {
      console.log('error has occured');
    }

  })
},10000)
