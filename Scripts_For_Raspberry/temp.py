import RPi.GPIO as GPIO;
import time;

GPIO.cleanup();
GPIO.setmode(GPIO.BCM);
GPIO.setup(2,GPIO.OUT);
GPIO.output(2,GPIO.LOW);
try:
	while 1:
		tempStore = open("/sys/bus/w1/devices/28-031571afaaff/w1_slave")	#change this number to the Device ID of your sensor
        data = tempStore.read()
        tempStore.close()
		tempData = data.split("\n")[1].split(" ")[9]
        temperature = float(tempData[2:])
        temperature = temperature/1000
        print temperature
		if(temperature > 35):
			GPIO.output(2,GPIO.HIGH);
		else:
			GPIO.output(2,GPIO.LOW);
		time.sleep(5)

except KeyboardInterrupt:
	GPIO.cleanup();
