#define kNumButtons 3
#define kDebounceDelay 500

const int buttonPins[kNumButtons] = {2,3,4};
int buttonStates[kNumButtons];
int prevButtonStates[kNumButtons];
long lastDebounceTime[kNumButtons];

void setup() {
  Serial.begin(9600);
  for(int i=0;i<kNumButtons;i++){
    pinMode(buttonPins[i], INPUT);       
  }
}

void loop(){
  for(int i=0;i<kNumButtons;i++){
    buttonStates[i] = digitalRead(buttonPins[i]);
    if(buttonStates[i] == HIGH && prevButtonStates[i] != HIGH && (millis() - lastDebounceTime[i]) >= kDebounceDelay){     
      Serial.print(i);
      Serial.print(1);
      prevButtonStates[i] = buttonStates[i];
      lastDebounceTime[i] = millis();
    }
    else if(buttonStates[i] == LOW && prevButtonStates[i] == HIGH && (millis() - lastDebounceTime[i]) >= kDebounceDelay){     
      prevButtonStates[i] = LOW;
      Serial.print(i);
      Serial.print(0);
    }
  } 
}
