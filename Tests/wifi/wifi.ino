// ESP32 - skenování WiFi sítí v okolí

// připojení potřebné knihovny
#include "WiFi.h"

void setup() {
  // nastavení komunikace po sériové lince
  Serial.begin(9600);
  // nastavení WiFI do módu stanice pro skenování
  WiFi.mode(WIFI_STA);
  // odpojení od sítí pro povolení skenování
  WiFi.disconnect();
  delay(100);
}
void loop() {
  // zahájení skenování
  Serial.println("scan start");
  // načtení počtu viditelných sítí do proměnné
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  // pokud nebyly načteny žádné sítě, vypiš informaci
  // po sériové lince
  if (n == 0) {
    Serial.println("no networks found");
  } 
  // v opačném případě vypiš všechny dostupné informace
  // o všech sítích v okolí
  else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // vytiskni název (SSID) a sílu signálu (RSSI)
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  // pauza před novým skenováním
  delay(5000);
}
