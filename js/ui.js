"use strict";

class Interface {
  constructor(hero) {
    //this.keysDown = {};
    this.hero = hero;

    addEventListener("keydown", function(e) {
      //this.keysDown[e.keyCode] = true;
        switch(e.keyCode){
          case 37:
            this.hero.setWalkAction(LEFT);
            break;
          case 39:
            this.hero.setWalkAction(RIGHT);
            break;
          case 38:
            this.hero.setWalkAction(UP);
            break;
          case 40:
            this.hero.setWalkAction(DOWN);
            break;
          case 32: e.preventDefault(); break; // Space
          default: break; // do not block other keys
        }
      }, false);

    //addEventListener("keyup", (e) => this.keysDown[e.keyCode] = false, false);
    
    addEventListener("click", this.onClick.bind(this), false);
  }
    
  onClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE);
    this.hero.setDestination(x, y);
  }
}
