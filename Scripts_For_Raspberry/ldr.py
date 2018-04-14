#Requirement - LDR and a Capacitor

import RPi.GPIO as GPIO
import time
from pymongo import MongoClient
client = MongoClient();
db = client.test;

GPIO.setmode(GPIO.BCM)

#define the pin that goes to the circuit

pin_to_circuit = 17

def rc_time (pin_to_circuit):
    count = 0
    #Output on the pin for
    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)
    time.sleep(0.2)	#discharging time of the capacitor

    #Change the pin back to input
    GPIO.setup(pin_to_circuit, GPIO.IN)

    #Count until the pin goes high
    while (GPIO.input(pin_to_circuit) == GPIO.LOW):
        count += 1

    return count

#Catch when script is interrupted, cleanup correctly
try:
    # Main loop
    while True:
    	time.sleep(5)
        value = rc_time(pin_to_circuit);
        print value
        db.values.update_one({"purpose":"LDR"},{'$set':{"value":value}});
        #update the database
except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
