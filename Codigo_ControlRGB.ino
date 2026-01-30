#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <ESPmDNS.h>

// ==========================================
// 1. CONFIGURACIÓN
// ==========================================
const char* ssid = "CAMPUS_EPN";
const char* password = "politecnica**";

#define PIN_LEDS 4        
#define NUM_LEDS 120
#define LEDS_PER_SECTION 40
#define NUM_SECTIONS 3

// ⚠️ PROTECCIÓN DE ENERGÍA: Crucial para cargador de 1.55A
// Limitamos el brillo para evitar caídas de voltaje y desconexiones
#define GLOBAL_BRIGHTNESS_LIMIT 70

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN_LEDS, NEO_GRB + NEO_KHZ800);
WebServer server(80);

// ==========================================
// 2. ESTRUCTURA DE ESTADO
// ==========================================
struct Section {
  bool power;
  String mode;
  int r, g, b, brightness;
  unsigned long lastUpdate;
  long step;
  bool blinkState;
};

Section sections[NUM_SECTIONS];

// ==========================================
// 3. SOLUCIÓN A CORS
// ==========================================
void sendCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOptions() {
  sendCORSHeaders();
  server.send(204); 
}

// ==========================================
// 4. MOTOR DE RENDERIZADO (SEGMENTADO)
// ==========================================
void renderSections() {
  unsigned long now = millis();
  for (int i = 0; i < NUM_SECTIONS; i++) {
    Section &s = sections[i];
    int start = i * LEDS_PER_SECTION;
    int end = start + LEDS_PER_SECTION;

    if (!s.power) {
      for (int j = start; j < end; j++) strip.setPixelColor(j, 0);
      continue;
    }

    // Mapeo de brillo seguro (0-100 de la web -> 0-GLOBAL_LIMIT)
    int safeBrightness = map(s.brightness, 0, 100, 0, GLOBAL_BRIGHTNESS_LIMIT);
    // Nota: Adafruit_NeoPixel aplica el brillo globalmente al llamar a show()
    // Para efectos independientes por sección, se simula con el valor del color si fuera necesario
    strip.setBrightness(safeBrightness);

    if (s.mode == "static") {
      for (int j = start; j < end; j++) strip.setPixelColor(j, strip.Color(s.r, s.g, s.b));
    } 
    else if (s.mode == "blink") {
      if (now - s.lastUpdate > 500) { s.lastUpdate = now; s.blinkState = !s.blinkState; }
      for (int j = start; j < end; j++) strip.setPixelColor(j, s.blinkState ? strip.Color(s.r, s.g, s.b) : 0);
    }
    else if (s.mode == "rainbow") {
      if (now - s.lastUpdate > 20) { s.lastUpdate = now; s.step += 256; }
      for (int j = start; j < end; j++) {
        int hue = s.step + (j * 65536L / LEDS_PER_SECTION);
        strip.setPixelColor(j, strip.gamma32(strip.ColorHSV(hue)));
      }
    }
  }
  strip.show();
}

// ==========================================
// 5. MANEJO DE API (POST)
// ==========================================
void handleLed() {
  sendCORSHeaders();
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    DynamicJsonDocument doc(4096);
    DeserializationError error = deserializeJson(doc, body);

    if (!error && doc.containsKey("s")) {
      JsonArray sArray = doc["s"];
      for (int i = 0; i < sArray.size() && i < NUM_SECTIONS; i++) {
        sections[i].power = sArray[i]["p"] == 1;
        sections[i].mode = sArray[i]["m"].as<String>();
        sections[i].r = sArray[i]["c"][0];
        sections[i].g = sArray[i]["c"][1];
        sections[i].b = sArray[i]["c"][2];
        sections[i].brightness = sArray[i]["b"];
      }
      server.send(200, "application/json", "{\"success\":true}");
      return;
    }
  }
  server.send(400, "application/json", "{\"error\":\"Datos Inválidos\"}");
}

// ==========================================
// 6. SETUP Y LOOP
// ==========================================
void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.setBrightness(20); 
  strip.show();

  // Inicializar estado apagado
  for(int i=0; i<NUM_SECTIONS; i++) { 
    sections[i].power = false; 
    sections[i].mode = "static"; 
    sections[i].brightness = 50; 
  }

  // CONEXIÓN POR DHCP (IP automática)
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi FABLAB");
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); 
    Serial.print("."); 
  }
  
  Serial.println("\n✅ CONECTADO");
  Serial.print("IP ASIGNADA: "); 
  Serial.println(WiFi.localIP()); // Mira esta IP en el monitor serial para ponerla en tu web

  if (MDNS.begin("luces")) {
    Serial.println("mDNS iniciado: http://luces.local");
  }

  server.on("/led", HTTP_POST, handleLed);
  server.on("/led", HTTP_OPTIONS, handleOptions);
  server.begin();
}

void loop() {
  server.handleClient();
  renderSections();
}