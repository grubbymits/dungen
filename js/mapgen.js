class MapGenerator {
  // Four tiles slot:
  // - empty
  // - floor
  // - path
  // - wall
  
  // Calculate what tile the given location should be for wall tiles.
  // This function handles rooms in caves.
  calcWallTile(vec) {
    if (N == EMPTY || N == FLOOR) {
      if (W == EMPTY) {
        return NW_CEILING;  // nw corner
      } else if (E == EMPTY) {
        return NE_CEILING;  // ne corner
      }
      return HORIZONTAL_CELING;
    }
    if (N == WALL && S == WALL) {
      if ((E == EMPTY || E == FLOOR) && (W == EMPTY || W == FLOOR)) {
        return VERTICAL_CEILING;
      } else if (E == EMPTY) {
        return SE_CELING;   // se corner
      } else if (W == EMPTY) {
        return SW_CEILING;  // sw corner
      }
      return WALL;
    }
    return FLOOR;
  }
  
  assignTiles() {
    if (type == WALL) {
      
    }
  }
}



// command line tool
// generate image, then ask the user if:
// - they want to keep the map?
// - if they want to replace the enemies?
// - if they want to replace the treasure?

// Maps to be generated:
// - caves
// - houses
// - town
// - forests
// - Meadows


// rooms and corridors to be a minimum of 9 tiles high, which would provide
// only 3 tiles of height on the floor tiles.

createPath();
createRoom();


decorateRoom(wallType, floorType);

decoratePath(floorType);
