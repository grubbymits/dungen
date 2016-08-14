function getBoundedRandom(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function calcOctant(start, end) {
  let deltaX = end.x - start.x; //- end.x;
  let deltaY = end.y - start.y; //- end.y;
  let absX = Math.abs(deltaX);
  let absY = Math.abs(deltaY);
  
  if (deltaX === 0) {
    if (deltaY > 0) {
      return 6;
    } else {
      return 1;
    }
  } else if (deltaY === 0) {
    if (deltaX > 0) {
      return 4;
    } else {
      return 3;
    }
  }
  
  if (deltaX <= 0 && deltaY < 0) {
    if (absX > absY) {
      return 0;
    } else {
      return 1;
    }
  } else if (deltaX >= 0 && deltaY <= 0) {
    if (absX > absY) {
      return 4;
    } else {
      return 2;
    }
  } else if (deltaX > 0 && deltaY >= 0) {
    if (absX > absY) {
      return 7;
    } else {
      return 6;
    }
  } else if (deltaX <= 0 && deltaY >= 0) {
    if (absX > absY) {
      return 3;
    } else {
      return 5;
    }
  }else {
    console.log("couldn't calculate octant!");
  }
}

function getOctantVec(x, y, col, row, octant) {
  switch(octant) {
    case 0: x -= col; y -= row; break;  // was 7
    case 1: x -= row; y -= col; break;  // was 6
    case 2: x -= row; y += col; break;  // was 5
    case 3: x += col; y -= row; break;  // was 0
    case 4: x -= col; y += row; break;  // was 4
    case 5: x += row; y -= col; break;  // was 1
    case 6: x += row; y += col; break;  // was 2
    case 7: x += col; y += row; break;  // was 3
  }
  return new Vec(x, y);
}
