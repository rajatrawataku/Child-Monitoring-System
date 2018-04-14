import requests
import json
import time
import yagmail
yag = yagmail.SMTP("email", 'password')


from pymongo import MongoClient
client = MongoClient('localhost',27017);
db = client.ESIOT;

TEMP_MAX = 35;

PiIP = "http://192.168.43.57:5005/";

while True:
    ## CHECK FOR AUTO OR MANUAL MODE
    try:
        print("Loop Running...");
        modeRecord = db.accounts.find_one({"purpose":"mode"});
        if(modeRecord['mode'] == "auto"):
            ## CHECK THE CURRENT TEMPERATUE SENSOR REPORT IN ACCOUNTS COLLECTION - FAN ON OFF
            print("Auto Mode On")
            record = db.accounts.find_one({"purpose":"temp"});
            if(record['tempThreshold'] == True):
                r = requests.get(PiIP + "turnFanON");
                response = json.loads(r.text);
                print("Fan State : " + response['response']);
                db.accounts.update_one({"purpose":"temp"},{'$set':{"fanState":True}});
                yag.send("emailTo", "Baby", "Needs Help")
            else:
                r = requests.get(PiIP + "turnFanOFF");
                response = json.loads(r.text);
                print("Fan State : " + response['response']);
                db.accounts.update_one({"purpose":"temp"},{'$set':{"fanState":False}});

            ## CHECK THE CURRENT LIGHT SENSOR REPORT IN ACCOUNTS COLLECTION - LIGHT ON OFF
            record = db.accounts.find_one({"purpose":"LDR"});
            if(record['lightThreshold'] == True):
                r = requests.get(PiIP + "turnLightON");
                response = json.loads(r.text);
                print("Light State : " + response['response']);
                db.accounts.update_one({"purpose":"LDR"},{'$set':{"lightState":True}});
            else:
                r = requests.get(PiIP + "turnLightOFF");
                response = json.loads(r.text);
                print("Light State : " + response['response']);
                db.accounts.update_one({"purpose":"LDR"},{'$set':{"lightState":False}});

            ## CHECK THE CURRENT SOUND SENSOR REPORT IN ACCOUNTS COLLECTION - MUSIC ON OFF
            record = db.accounts.find_one({"purpose":"sound"});
            if(record['soundThreshold'] == True):
                r = requests.get(PiIP + "turnMusicON");
                response = json.loads(r.text);
                print("Music State : " + response['response']);
                db.accounts.update_one({"purpose":"sound"},{'$set':{"musicState":True}});
                yag.send("rohan183chougule@gmail.com", "Baby", "Needs Help")
            else:
                r = requests.get(PiIP + "turnMusicOFF");
                response = json.loads(r.text);
                print("Music State : " + response['response']);
                db.accounts.update_one({"purpose":"sound"},{'$set':{"musicState":False}});
        time.sleep(5);
    except:
        print("trying, some error")
