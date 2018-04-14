var socket = require('socket.io-client')('http://localhost:5000');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

//socket.on('connect', function(){});
const SOUND_THRESHOLD = 30;
timeWhenThresholdCrossed = 0;
thresholdCrossedTime = []
count = 0;


socket.emit('my_ping');

setInterval(()=>{
  socket.emit('maintain');
},2000)

socket.on("maintain2",function(){
  console.log("maintaining connection ....")
})


socket.on('my_pong',function(data){
  console.log(data.data);

  thresholdCrossedTime.push(data.data);
  lengthArr = thresholdCrossedTime.length;
  console.log("Length of Sound Threshold Array : " + lengthArr);
  console.log("Threshold Array : ");
  console.log(thresholdCrossedTime);

  count = 0;
  for(let i = 0; i < lengthArr; i++){
    //console.log("COUNT VALUE : " + count)
    if(thresholdCrossedTime[i] > SOUND_THRESHOLD){
      count++;
      if(lengthArr < 10 && count > 5){
        console.log("Array Threshold Crossed : " + count + " :: " + lengthArr);
        thresholdCrossedTime = []
        count = 0;
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"sound"},{$set:{soundThreshold:true}},function(err,res){
            if(err) throw err;
            console.log("SOUND_THRESHOLD : TRUE");
          })
        })
      }
      else if(lengthArr >= 10 && count < 5){
        console.log("Array Threshold Cleared")
        thresholdCrossedTime = [];
        count = 0;
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var ESIOT = db.db('ESIOT');
          var collection = ESIOT.collection('accounts');
          collection.updateOne({"purpose":"sound"},{$set:{soundThreshold:false}},function(err,res){
            if(err) throw err;
            console.log("SOUND_THRESHOLD : FALSE");
          })
        })
      }
      else if(lengthArr >= 10 && count <= 5){
        //count = 0;
      }
    }
  }

})

//socket.on('event', function(data){});
socket.on('disconnect', function(){});
