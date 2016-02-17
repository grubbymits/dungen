"use strict";

class Interface {
  constructor(hero) {
    //this.keysDown = {};
    this.hero = hero;
    
    var hud = document.createElement("canvas");
    hud.style.position = 'absolute';
    hud.style.left = '5px';
    hud.style.top = '5px';
    hud.style.width = '256px';
    hud.style.height = '64px'
    hud.style.background = "#669999";
    document.body.appendChild(hud);
    this.hudContext = hud.getContext("2d");

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
  
  renderHUD() {
    this.hero.sprite.render(1, 1,
                            this.hudContext);
  }
    
  onClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE);
    this.hero.setDestination(x, y);
  }
}
