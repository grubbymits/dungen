#include <array>
#include <iostream>
#include <fstream>

using namespace std;

int main(void) {
  const unsigned XOffset = 0;
  const unsigned YOffset = 7;
  const unsigned Size = 10;

  array<const char*, Size> ItemNames = {
    "sword", "axe", "throwing", "bow", "bomb", "arrow", "armour", "helmet",
    "shield", "staff" };
  array<const unsigned, Size> NumItems = { 8, 8, 3, 5, 3, 5, 8, 8, 8, 8 };

  ofstream output;
  output.open("items.css");

  auto Write = [&output](unsigned x, unsigned y, string &name) {
    const unsigned TileWidth = 64;
    const unsigned TileHeight = 64;
    int PixelX = -x * TileWidth;
    int PixelY = -y * TileHeight;

    output << "." << name << " {\n";
    output << "  object-position: " << PixelX << "px " << PixelY << "px;\n}\n";
  };

  for (unsigned i = 0; i < ItemNames.size(); ++i) {
    for (unsigned j = 0; j < NumItems[i]; ++j) {
      string ItemName = ItemNames[i];
      ItemName += "-" + to_string(j);
      Write(XOffset + j, YOffset + i, ItemName);
    }
  }
  output.close();
  return 0;
}
