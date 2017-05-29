
// states
//	0: Standby / off
//	1: Booting up
//	2: Running / on
//	3: Shutting down
int state = 0;

const int pinRelay = 0;
const int pinOnboardLED = 1;
const int pinButton = 4;
const int pinRaspberryTx = 3;	// signals pi to shut down
const int pinRaspberryRx = 2;	// signals atx that pi is booted up and shutting down

bool lastButton = 0;
bool lastPiRx = 0;

bool onboardLED = false;
const int loopDelay = 10;
const int powerOffDelay = 20000;	// milliseconds
int powerOffWaitTimer = 0;

void setup()
{
	pinMode(pinRelay, OUTPUT);
	pinMode(pinButton, INPUT_PULLUP);
	pinMode(pinRaspberryTx, OUTPUT);
	pinMode(pinRaspberryRx, INPUT_PULLUP);
	pinMode(pinOnboardLED, OUTPUT);

	digitalWrite(pinRelay, 1);
	digitalWrite(pinRaspberryTx, 0);
	digitalWrite(pinOnboardLED, 0);
}

void loop()
{
	bool button = digitalRead(pinButton);
	bool piRx = digitalRead(pinRaspberryRx);

	// has button pressed
	if (button != lastButton)
	{
		switch (state)
		{
			// Standby: Power relay
			case 0:
				digitalWrite(pinRelay, 0);
				state = 1;
				break;

			// Running: Signal pi to shutdown
			case 2:
				state = 3;
				powerOffWaitTimer = 0;
				digitalWrite(pinRaspberryTx, 1);
				digitalWrite(pinOnboardLED, 0);
				break;
		}
	}

	// has pi signal changed
	if (piRx != lastPiRx)
	{
		switch (state)
		{
			// Booting: Pi is booted up
			case 1:
				digitalWrite(pinOnboardLED, 1);
				state = 2;
				break;

			// Running: Pi has signaled, its shutting down
			case 2:
				state = 3;
				powerOffWaitTimer = 0;
				digitalWrite(pinOnboardLED, 0);
				break;
		}
	}

	// pi is shutting down
	if (state == 3)
	{
		// sum up wait
		powerOffWaitTimer += loopDelay;

		// blink onboard led
		if (powerOffWaitTimer % 100 == 0)
		{
			digitalWrite(pinOnboardLED, onboardLED = !onboardLED);
		}

		// wait delay reached, power off
		if (powerOffWaitTimer > powerOffDelay)
		{
			digitalWrite(pinRelay, 1);
			digitalWrite(pinRaspberryTx, 0);
			digitalWrite(pinOnboardLED, 0);
			state = 0;
		}
	}

	// save last state
	lastButton = button;
	lastPiRx = piRx;

	delay(loopDelay);
}
