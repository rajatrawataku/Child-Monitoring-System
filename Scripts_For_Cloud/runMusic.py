from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import subprocess

app = Flask(__name__)
CORS(app);

@app.route("/play",methods=['GET','POST'])
def play():
    print("playing song")
    cmmd = "vlc 1.mp3"
    subprocess.call(cmmd.split(), shell = True);
    return "done"

@app.route("/closePlay",methods=['GET','POST'])
def closePlay():
    print("in close");
    cmmd = "taskkill /im vlc.exe /t";
    subprocess.call(cmmd.split(), shell = True);
    return "done";

if(__name__=='__main__'):
    app.run('0.0.0.0',port=5008, threaded=True);
