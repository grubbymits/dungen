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