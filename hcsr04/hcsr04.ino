#include <NewPing.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <OSCMessage.h>
 
const char* ssid = "TP-Link_D66A";
const char* password =  "73968030";

WiFiUDP Udp; 
const IPAddress outIp(192,168,0,2);
const unsigned int outPort = 8000;

#define TRIGGER_PIN 14
#define ECHO_PIN 13

const float MAX_DISTANCE = 200.0;

bool connected = false;
int lastPing = 0;

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void setup() {

    Serial.begin(115200);
    WiFi.begin(ssid, password);
 
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
      Serial.println(WiFi.status());
    }
    Serial.println("Connected to the WiFi network!"); 
   // Udp.begin(9999);
    connected = true;
}

void loop() {
    if (connected) {
        delay(50);

        unsigned int uS = sonar.ping();

        pinMode(ECHO_PIN,OUTPUT);

        digitalWrite(ECHO_PIN,LOW);

        pinMode(ECHO_PIN,INPUT);

        int ping = (uS / US_ROUNDTRIP_CM);

        if (ping > 0 && ping != lastPing) {
            lastPing = ping;
            OSCMessage msg("/slide");
           // msg.add("hello-slide");
            float value = ping / MAX_DISTANCE;
            msg.add (ping);
            Udp.beginPacket(outIp, outPort);
            msg.send(Udp); 
            Udp.endPacket();
            msg.empty();
            Serial.println(ping);
            Serial.println(value);
        }

    }

}
