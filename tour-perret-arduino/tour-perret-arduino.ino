#include "BluetoothSerial.h"
#include <ArduinoJson.h>
// installer la bibliothèque Adafruit DMA neopixel library by adafruit (outils ->gérer les bibliothèques..)
// Définir la carte utilisée (outils ->type de carte)


#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 32  //On définit le pin où est connecté la patte DATA du bandeau

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)

#define NB_led 60  //le nombre des leds
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NB_led, PIN, NEO_GRB + NEO_KHZ800);

// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.


BluetoothSerial SerialBT;

//config pin
int BUTTON_PIN = 0;
int ledPin = 5;

// variables globales
char scenar[1000];
int coul_et[4][100];
char tab[8];


int lecture_UART()
{
  char c='0'; //condition d'entrée dans la boucle
  int taille_scenar=0;

  // Reception de caractères correspondant à un scenario de la forme  : [[111,222,333,4444],[111,222,...
  while (((c >= '0') && (c <= '9')) || (c == '[') || (c == ']') || (c == ','))
  {
    c = Serial.read(); //Reception des données en UART
    
    if(((c >= '0') && (c <= '9'))|| (c == ','))
    {
      scenar[taille_scenar]=c; //Remplissage des données reçu dans un tableau pour le traitement du scenario
      taille_scenar++;
    }
  }
  return taille_scenar;
}

int lecture_BT()
{
  char c='0'; //condition d'entrée dans la boucle
  int taille_scenar=0;

  // Reception de caractères correspondant à un scenario de la forme : [[111,222,333,4444],[111,222,...
  while (((c >= '0') && (c  <= '9')) || (c == '[') || (c == ']') || (c == ','))
  {
    c = Serial.read(); //Reception des données en Bluetooth
    
    if(((c >= '0') && (c <= '9'))|| (c == ','))
    {
      scenar[taille_scenar]=c; //Remplissage des données reçu dans un tableau pour le traitement du scenario
      taille_scenar++;
    }
  }
  return taille_scenar;
}

int parser(int taille_scenar)
{
  int m=0;
  int n=0;
  int v=0;
  int num_champs = 0;
  int nb_sequ=0;

  //Parser du Scenario reçu
  Serial.print("\n Affiche trame recu  \n ");
  for(int i=0;i<taille_scenar;i++)
  {
    Serial.print(scenar[i]);
  }
  while(n<taille_scenar)
  {
     while((scenar[n] >= '0') && (scenar[n] <= '9'))
    { 
       tab[m]=scenar[n]; //remplissage d'une table intermediaire destiné à la conversion d'un tableau de caractère à la valeur de l'entier correspondant
       m++; 
       n++;
    }
     String tabb(tab); //Conversion du tableau de caractère en format String (pour être utiliser avec la fonction "toInt()"
      for(int p=0;p<=8;p++)
     {
       tab[p]=NULL; //Initialisation de la table intermediaire pour les taches avenir
     }
     m=0; //initialisation du curseur
     coul_et[num_champs][nb_sequ]=tabb.toInt(); // Affectation  des différents champs dans un tableau de gestion du scenario et conversion du format string en int
     //Decoupage des différentes séquences du scenario
     if(scenar[n]==',')
     {
      v++;
      if(v==4) //Nouvelle sequence toutes les 4 virgules reçus, ex : [[111,222,333,4444],[111,222,...
      {
        nb_sequ++;
        v=0;
      }
      else //remplissage des différents champs => 1 : couleur etage 1 / 2 : couleur etage 2 / 3 : couleur etage 3 / 4 : duree 
      {
        num_champs++;
        if (num_champs==4)  
        {
          num_champs=0;
        }
      }
      n++;
     }
  }  
  return nb_sequ; //retourne le nombre de sequence du scenario qui va être utilisé dans la lecture du scenario
}

void play(int nb_seq)
{
  Serial.print("\n Affiche trame après parser : \n");
  for (int l = 0; l <= nb_seq; l++)
  {
    for (int i = 0; i < 20; i++ ) { //  boucle pour définir les 12  premières led du 1er étage
     strip.setPixelColor(i, (int)(coul_et[0][l] % 256) , (int)(coul_et[0][l] % 65536) / 256, (int)(coul_et[0][l] / 65536));
          strip.show(); // on affiche
    strip.setBrightness(100); //Luminosité
    }
    for (int i = 20; i < 40; i++ ) { //  boucle pour définir les 12 suivantes du 2ème étage
      strip.setPixelColor(i, (int)(coul_et[1][l] % 256) , (int)(coul_et[1][l] % 65536) / 256, (int)(coul_et[1][l] / 65536));
          strip.show(); // on affiche
    strip.setBrightness(100); //Luminosité
    }
    for (int i = 40; i < 60; i++ ) { //  boucle pour définir les 12 leds suivantes du 3ème étage
      strip.setPixelColor(i, (int)(coul_et[2][l] % 256) , (int)(coul_et[2][l] % 65536) / 256, (int)(coul_et[2][l] / 65536));
          strip.show(); // on affiche
    strip.setBrightness(100); //Luminosité
    }
    delay(coul_et[3][l]);

//    for(int j=0;j < 4;j++)
//    {
//      Serial.print(coul_et[j][l]);     
//       Serial.print('\t');
//    }
//    Serial.print('\n');
  }
  
}


void setup()
{  
  //Definition des pinmode
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
 
  //Ouverture des ports Séries
 // Serial.begin("ESP32");
  Serial.begin(115200); //Définition du baudrate (Mode UART) doit être identique coté serveur Node (voir TourPerret-Node-master/live.js)

  
  strip.begin(); // Lance la connection
  strip.show(); // Initialise toutes les led à 'off'

     for(int p=0;p<=8;p++)
     {
       tab[p]=NULL; //Initialisation de la table intermediaire pour convertir un tableau decaractere de chiffre vers la valeur de l entier
     }
}

void loop()
{
   int mode_comm = 0;
  int i=0;
  int nb_sequ = 0;
  char c1;
  int taille_scenar;
  
  //Mode UART
  while (mode_comm == 0)
  {
    digitalWrite(ledPin, LOW); //Mode UART : Led Eteinte
    c1=Serial.read();
   if(c1=='[') //Condition de démarrage du décodage des données reçues
   {
        taille_scenar=lecture_UART();
        nb_sequ=parser(taille_scenar);
        play(nb_sequ);
   }
    if (digitalRead(BUTTON_PIN) == LOW)
    { // Check if button has been pressed
      while (digitalRead(BUTTON_PIN) == LOW)
        ; // Wait for button to be released
      mode_comm++;
    }
  }

  //Mode Bluetooth
  while (mode_comm == 1)
  {  
    digitalWrite(ledPin, HIGH); //Mode Bluetooth : Led Allumer
    c1=Serial.read();
   if(c1=='[') //Condition de démarrage du décodage des données reçues
   {
        taille_scenar=lecture_BT();
        nb_sequ=parser(taille_scenar);
        play(nb_sequ);
   }
    if (digitalRead(BUTTON_PIN) == LOW)
    { // Check if button has been pressed
      while (digitalRead( BUTTON_PIN) == LOW)
        ; // Wait for button to be released
      mode_comm++;
    }
  }
  
  //Mode Wi-Fi
  while (mode_comm == 2)
  {
    while (i < 3)
    {
      digitalWrite(ledPin, HIGH);
      delay(500);
      digitalWrite(ledPin, LOW);
      delay(500);
      i++;
    }
    //Decodage Wi-Fi à écrire
    
    if (digitalRead(BUTTON_PIN) == LOW)
    { // Check if button has been pressed
      while (digitalRead( BUTTON_PIN) == LOW)
        ; // Wait for button to be released
      mode_comm++;
    }
  }
  if (mode_comm == 3)
  {
    mode_comm = 0;
  }
}
