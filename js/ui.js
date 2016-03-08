"use strict";

class Interface {
  constructor(player) {
    //this.keysDown = {};
    this.player = player;
    this.hudVisible = false;

    this.hud = document.createElement("canvas");
    this.hud.style.position = 'absolute';
    this.hud.width = TILE_SIZE * 20 * UPSCALE_FACTOR;
    this.hud.height = TILE_SIZE * 15 * UPSCALE_FACTOR;
    this.hud.style.left = '50%';
    this.hud.style.top = '50%';
    //this.hud.style.bottom = '0px';
    //this.hud.style.top = '0px';
    //this.hud.style.margin = 'auto';
    this.hud.style.visibility = 'hidden';
    this.hud.style.transform = 'translate(-50%, -50%)';
    this.hud.style.background = "rgba(50, 75, 75, 0.7)";
    document.body.appendChild(this.hud);
    this.hudContext = this.hud.getContext("2d");

    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("hud_button").addEventListener("click", this.controlHUD.bind(this), false);
    document.getElementById("gameCanvas").addEventListener("click", this.onClick.bind(this), false);
  }

  renderHUD() {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //this.hudContext.fillStyle = "rgba(50, 75, 75, 0.8)";
    this.hudContext.clearRect(0, 0, this.hud.width, this.hud.height);
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "green";
    this.hudContext.textAlign = "left";

    for (let i in this.player.heroes) {
      let hero = this.player.heroes[i];
      let offsetX = TILE_SIZE;
      let offsetY = TILE_SIZE + (TILE_SIZE * 2 * i);

      hero.sprite.render(offsetX, offsetY, this.hudContext);

      if (hero.weapon) {
        hero.weapon.sprite.render(offsetX + 2 * TILE_SIZE, offsetY, this.hudContext);
      }
      if (hero.shield) {
        hero.shield.sprite.render(offsetX + 4 * TILE_SIZE, offsetY, this.hudContext);
      }
      else if (hero.arrows) {
        hero.arrows.sprite.render(offsetX + 4 * TILE_SIZE, offsetY, this.hudContext);
      }
      if (hero.armour) {
        hero.armour.sprite.render(offsetX + 6 * TILE_SIZE, offsetY, this.hudContext);
      }
      if (hero.helmet) {
        hero.helmet.sprite.render(offsetX + 8 * TILE_SIZE, offsetY, this.hudContext);
      }
      this.hudContext.fillText("Lvl: " + hero.level,
                               offsetX + 11 * TILE_SIZE,
                               offsetY);
      this.hudContext.fillText("Exp to next Lvl: " + (hero.expToNextLvl - hero.currentExp),
                               offsetX + 11 * TILE_SIZE,
                               offsetY + TILE_SIZE);
      this.hudContext.fillText("Health: " + hero.currentHealth + "/" + hero.maxHealth,
                               offsetX + 11 * TILE_SIZE,
                               offsetY + 2 * TILE_SIZE);
      this.hudContext.fillText("Energy: " + hero.currentEnergy + "/" + hero.maxEnergy,
                               offsetX + 11 * TILE_SIZE,
                               offsetY + 3 * TILE_SIZE);
    }
  }

  onClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE);
    this.player.setDestination(x, y);
  }

  controlHUD(event) {
    if (!this.hudVisible) {
      this.hud.style.visibility = 'visible';
      this.hudVisible = true;
    } else {
      this.hud.style.visibility = 'hidden';
      this.hudVisible = false;
    }
  }
}
