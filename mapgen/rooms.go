type Room struct {
  x, y, width, height uint
  visited bool
  connections map[Room] bool
}

//    this.centre = new Vec(x + Math.floor(width / 2),
  //                        y + Math.floor(height / 2));

func chooseDims(type uint) {
  w := 0
  h := 0

  if type == LARGE {
    // 23, 21, 19, 17, 15
    w = Floor(rand.Float32() * 3) + MIN_LARGE
    h = Floor(rand.Float32() * 3) + MIN_LARGE
  }
  if type == MEDIUM {
    // 19, 17, 15, 13, 11
    w = Floor(rand.Float32() * 5) + MIN_MEDIUM
    h = Floor(rand.Float32() * 5) + MIN_MEDIUM
  }
  if type == SMALL {
    // 15, 13, 11, 9
    w = Floor(rand.Float32() * 5) + MIN_SMALL
    h = Floor(rand.Float32() * 5) + MIN_SMALL
  }
  return {width : w, height : h};
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
      dims := chooseDims(i)

        if (this.isSpace(x, y, dims.width, dims.height)) {
          console.log("placing room at (x, y):", x, y, "of size:", dims.width, dims.height);
          this.createRoom(x, y, dims.width, dims.height);
          rooms++;
          roomsToPlace--;
          attempts = 0;
        }
        attempts++;
      }
    }
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
        distance := getDistance(connectedRoom, unconnectedRoom)
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