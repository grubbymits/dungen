"use strict";

class Interface {
  constructor(player) {
    //this.keysDown = {};
    this.player = player;

    this.hud = document.createElement("canvas");
    this.hud.style.position = 'absolute';
    this.hud.width = TILE_SIZE * 4 * UPSCALE_FACTOR;
    this.hud.height = TILE_SIZE * UPSCALE_FACTOR;
    this.hud.style.left = '0px';
    this.hud.style.top = '0px';
    this.hud.style.background = "rgba(50, 75, 75, 0.8)";
    document.body.appendChild(this.hud);
    this.hudContext = this.hud.getContext("2d");

    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("gameCanvas").addEventListener("click", this.onClick.bind(this), false);
  }

  renderHUD() {
    /*
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    this.hud.style.left = offsetX + 'px';
    this.hud.style.top = offsetY + 'px';
    if (this.hero.weapon) {
      this.hero.weapon.sprite.render(0, 0, this.hudContext);
    }
    if (this.hero.shield) {
      this.hero.shield.sprite.render(1 * TILE_SIZE, 0, this.hudContext);
    }
    else if (this.hero.arrows) {
      this.hero.arrows.sprite.render(1 * TILE_SIZE, 0, this.hudContext);
    }
    if (this.hero.armour) {
      this.hero.armour.sprite.render(2 * TILE_SIZE, 0, this.hudContext);
    }
    if (this.hero.helmet) {
      this.hero.helmet.sprite.render(3 * TILE_SIZE, 0, this.hudContext);
    }
    */
  }

  onClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE);
    this.player.setDestination(x, y);
  }
}
