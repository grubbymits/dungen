import (
  "math"
)

type Vec struct {
  x uint
  y uint
}

type Location struct {
  vec Vec
  isBlocked bool
  entity Entity
  tileType uint
}

type Room struct {
  x, y, width, height uint
  visited bool
  connections map[Room] bool
}

func getDistanceCost(to, from Vec) (uint)
  costX := Abs(from.x - to.x) * 2;
  costY := Abs(from.y - to.y) * 2;
  if costX == 0 {
    return costY;
  } else if costY == 0 {
    return costX;
  } else {
    return Sqrt(Pow(costX, 2) + Pow(costY, 2));
  }
}

//    this.centre = new Vec(x + Math.floor(width / 2),
  //                        y + Math.floor(height / 2));

func chooseDims(roomSize uint) (uint, uint) {
  w := 0
  h := 0

  if roomSize == LARGE {
    // 23, 21, 19, 17, 15
    w = Floor(rand.Float32() * 3) + MIN_LARGE
    h = Floor(rand.Float32() * 3) + MIN_LARGE
  }
  if roomSize == MEDIUM {
    // 19, 17, 15, 13, 11
    w = Floor(rand.Float32() * 5) + MIN_MEDIUM
    h = Floor(rand.Float32() * 5) + MIN_MEDIUM
  }
  if roomSize == SMALL {
    // 15, 13, 11, 9
    w = Floor(rand.Float32() * 5) + MIN_SMALL
    h = Floor(rand.Float32() * 5) + MIN_SMALL
  }
  return w, h;
}

func isSpace(startX, startY, width, height uint) (bool) {
  for x := startX; x < startX + width; x++ {
    for y := startY; y < startY + height; y++ {
      if isOutOfRange(x, y) {
        return false;
      }
      // Only carve rooms into 'blocked' ceiling regions
      if locations[x][y].isBlocked {
        return false;
      }
    }
  }
  return true;
}

func placeRooms(roomsToPlace) {
  numBigRooms := Floor(roomsToPlace / 6);
  numMediumRooms := Floor(2 * roomsToPlace / 6);
  numSmallRooms := Floor(3 * roomsToPlace / 6);
  maxAttempts := 200;

  // place larger rooms first
  numRooms := [3]uint {numBigRooms, numMediumRooms, numSmallRooms}

  for i := 0; i < 3 && roomsToPlace != 0; i++ {
    rooms := 0
    attempts := 0
    
    for attempts < maxAttempts && rooms < numRooms[i] {

      x := getRandomX()
      y := getRandomY()
      w, h := chooseDims(i)

        if isSpace(x, y, w, h) {
          newRoom := createRoom(x, y, w, h);
          rooms.append(newRoom);
          rooms++;
          roomsToPlace--;
          attempts = 0;
        }
        attempts++;
      }
    }
}

func createRoom(startX, startY, w, h uint) (Room) {
  room := Room {x : startX, y : startY, width : w, height : h};
  //rooms.push(room);
  // Top 3 rows of tiles need to be set to WALL, as do the bottom 3 rows.
  // The two vertical borders also need to be WALL and then the remaining
  // can be set to FLOOR.
  for x := startX+1; x < startX + width-1; x++ {
    for y := startY+1; y < startY + height-2; y++ {
      locations[x][y].blocked = false;
      placeTile(x, y, PATH, false);
    }
  }
  return room;
}

func connectRooms(rooms []Room) {
  var connectedRooms = map[Room] bool
  var unconnectedRooms = map[Room] bool

  var to, from Room

  for room := in range rooms {
    unconnectedRooms[room] = true
  }
  
  start := rooms[0]
  connectedRooms[start] = true
  delete(unconnectedRooms, start)
  
  for len(unconnectedRooms) != 0 {
    minDistance := MAP_WIDTH_PIXELS * MAP_HEIGHT_PIXELS;
    for connectedRoom, _ := range connectedRooms {
      for unconnectedRoom, _ := range unconnectedRooms {
        distance := getDistanceCost(connectedRoom, unconnectedRoom)
        if distance < minDistance {
          minDistance = distance
          from = connectedRoom
          to = unconnectedRoom
        }
      }
    }
    from.connections[to] = true
    delete(unconnectedRooms, to);
    connectedRooms[to] = true
  }
  
  for currentRoom, _ := range connectedRooms {
    for neighbour := range currentRoom.connections {
      x := currentRoom.centre.x
      x := currentRoom.centre.y
      destX := neighbour.centre.x
      destY := neighbour.centre.y
      
      for x < destX {
        ++x
        layPath(x, y)
      }
      for x > destX {
        --x
        layPath(x, y)
      }
      for y < destY {
        ++y
        layPath(x, y)
      }
      for y > destY {
        --y
        layPath(x, y)
      }
    }
  }
}

/*
    while (unconnectedRooms.size !== 0) {
      let minDistance = MAP_WIDTH_PIXELS * MAP_HEIGHT_PIXELS;
      for (let connectedRoom of connectedRooms.values()) {
        for (let unconnectedRoom of unconnectedRooms.values()) {
          if (connectedRoom.getDistance(unconnectedRoom) < minDistance) {
            minDistance = connectedRoom.getDistance(unconnectedRoom);
            from = connectedRoom;
            to = unconnectedRoom;
          }
        }
      }
      from.addNeighbour(to);
      unconnectedRooms.delete(to);
      connectedRooms.add(to);
    }

    // add 'rooms' to create paths between the connected rooms
    for (let current of connectedRooms.values()) {

      for (let neighbour of current.connections) {
        let x = current.centre.x;
        let y = current.centre.y;

        if (current.centre.x < neighbour.centre.x) {
          while (x < neighbour.centre.x) {
            ++x;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        } else if (current.centre.x > neighbour.centre.x) {
          while (x > neighbour.centre.x) {
            --x;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        }
        if (current.centre.y < neighbour.centre.y) {
          while (y < neighbour.centre.y) {
            ++y;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        } else if (current.centre.y > neighbour.centre.y) {
          while (y > neighbour.centre.y) {
            --y;
            this.createRoom(x, y, PATH_WIDTH, PATH_WIDTH);
          }
        }
      }
    }
    */