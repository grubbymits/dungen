#include <array>
#include <iostream>
#include <fstream>

using namespace std;
/*
struct Weapon {
  const std::string *name = nullptr;
  const std::string *sprites = nullptr;
  unsigned type = 0
  unsigned subtype = 0;
  unsigned elem = 0;
  unsigned duration = 1;
  unsigned energy = 1;
};

static void DefineWeapon(Weapon &item, &js) {
  js << "  { name: " << *item.name << ",\n"
     << "    elemType: " << item.elem << ",\n"
     << "    effectDuration: " << item.duration << ",\n"
     << "    energy: " << item.energy << ",\n";
     << "    sprites: " << item.sprites << ",\n";
     << "    sprite : function() { return this.sprites[ " << subtype << "];}";
     << "  },\n";
}
*/

int main(void) {
  unsigned XOffset = 0;
  unsigned YOffset = 7;
  const unsigned Size = 10;
  const unsigned TileWidth = 64;
  const unsigned TileHeight = 64;

  array<const char*, Size> ItemNames = {
    "sword", "axe", "throwing", "bow", "bomb", "arrow", "armour", "helmet",
    "shield", "staff" };
  array<const char*, Size> ItemDefs = {
    "SWORD", "AXE", "THROWING", "BOW", "BOMB", "ARROW", "ARMOUR", "HELMET",
    "SHIELD", "STAFF" };
  array<const unsigned, Size> NumItems = { 8, 8, 3, 5, 3, 5, 8, 8, 8, 8 };

  ofstream css;
  css.open("items.css");
  ofstream js;
  js.open("item-def.js");

  for (unsigned item = 0; item < ItemNames.size(); ++item) {
    js << "const " << ItemDefs[item] << " = " << item << ";\n";

    for (unsigned number = 0; number < NumItems[item]; ++number) {
      string ItemName = ItemNames[item];
      int x = XOffset + number;
      int y = YOffset;
      int PixelX = -x * TileWidth;
      int PixelY = -y * TileHeight;

      css << "." << ItemNames[item] << "-" << number << " {\n";
      css << "  object-position: " << PixelX << "px " << PixelY << "px;\n}\n";

      js << "const " << ItemDefs[item] << number << " = " << number << ";\n";
    }

    if (NumItems[item] < 8) {
      XOffset += NumItems[item];
      XOffset %= 8;
    }
    if (XOffset == 0)
      ++YOffset;

    js << "const " << ItemDefs[item] << "_CLASS = [\n";

    for (unsigned number = 0; number < NumItems[item]; ++number)
      js << "  \"" << ItemNames[item] << "-" << number << "\",\n";

    js << "];\n"; 
  }
  css.close();
  js.close();
  return 0;
}
