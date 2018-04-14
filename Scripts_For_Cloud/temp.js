var request = require('request')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

//socket.on('connect', function(){});
const TEMP_THRESHOLD = 32;

setInterval(()=>{
  request({
    headers : {'content-type' : 'application/x-www-form-urlencoded'},
    url : 'http://192.168.43.57:5005/getTemp',
    method : 'GET',
  },(err,res,body)=>{

    try{

      body = JSON.parse(body);
      value = body.response;
      console.log(value);
      if(value > TEMP_THRESHOLD){
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"temp"},{$set:{tempThreshold:true, tempValue:value}},function(err,res){
            if(err) throw err;
            console.log("TEMP_THRESHOLD : TRUE");
          })
        })
      }
      else if(value < TEMP_THRESHOLD){
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"temp"},{$set:{tempThreshold:false, tempValue:value}},function(err,res){
            if(err) throw err;
            console.log("TEMP_THRESHOLD : FALSE");
          })
        })
      }

    }catch(e)
    {


    }

  })
},10000)
