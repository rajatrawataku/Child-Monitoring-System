import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(27,GPIO.OUT)
GPIO.setup(23,GPIO.OUT)

print "fan on"
GPIO.output(27,GPIO.HIGH)
GPIO.output(23,GPIO.HIGH)
