from flask import Flask
from flask_cors import CORS,cross_origin
from flask import request
from flask import jsonify
import json
import requests
import RPi.GPIO as GPIO
import subprocess
from pymongo import MongoClient
client = MongoClient();
db = client.test;

## SET THE STATE LIGHTS TO THE REQUIRED STATES AS WELL ( RED COLOR ) ## CALL THE SUBPROCESS IN SIMILAR MANNER
## PUT ALL STATE CHANGING FILES IN THE ROOT DIRECTORY OF THE SERVER CODE, AND NAME THEM ACCORDINGLY

app = Flask(__name__);
CORS(app);


# MANUAL MODE CONFIGURATION
@app.route("/turnFanON",methods=['GET','POST'])
def turnFanON():
#python code to turn fan on
    pythonCommand = "python fanON.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "ON",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/turnFanOFF",methods=['GET','POST'])
def turnFanOFF():
    #python code to turn fan OFF
    pythonCommand = "python fanOFF.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "OFF",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/turnLightON",methods=['GET','POST'])
def turnLightON():
    #python code to turn Light on
    pythonCommand = "python LightON.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "ON",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/turnLightOFF",methods=['GET','POST'])
def turnLightON():
    #python code to turn light off
    pythonCommand = "python LightOFF.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "OFF",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/turnMusicON",methods=['GET','POST'])
def turnMusicON():
    #python code to turn music on
    pythonCommand = "python MusicON.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "ON",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/turnMusicOFF",methods=['GET','POST'])
def turnMusicOFF():
    #python code to turn Music off
    pythonCommand = "python MusicOFF.py"  # launch your python2 script using bash
    process = subprocess.run(pythonCommand, shell=True, check=True, stdout=subprocess.PIPE)
    print(process.stdout)

    responseVar = {
        "status" : 200,
        "response" : "OFF",
        "type" : "string"
    }

    return jsonify(dict(responseVar));

@app.route("/getTemp",methods=['GET','POST'])
def getTemp():
    record = db.values.find_one({"purpose":"temp"});
    responseVar = {
        "status" : 200,
        "response" : record['value'],
        "type" : "integer"
    }

    return jsonify(dict(responseVar));

@app.route("/getLDR",methods=['GET','POST'])
def getLDR():
    record = db.values.find_one({"purpose":"LDR"});
    responseVar = {
        "status" : 200,
        "response" : record['value'],
        "type" : "integer"
    }

    return jsonify(dict(responseVar))

if(__name__=='__main__'):
    app.run('0.0.0.0', port=5005, threaded = True);
