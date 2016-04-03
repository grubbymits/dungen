"use strict";

class UIEvent {
  constructor(context, start, millisecs, pos) {
    this.context = context;
    this.startTime = start;
    console.log("construct event, pos: ", pos);
    this.endTime = this.startTime + millisecs;
    this.position = pos;
    this.x = pos.x * TILE_SIZE * UPSCALE_FACTOR;
    this.y = pos.y * TILE_SIZE * UPSCALE_FACTOR;
  }
  get pos() {
    return this.position;
  }
  isFinished() {
    return (new Date().getTime() >= this.endTime);
  }
}

class TextEvent extends UIEvent {
  constructor(context, start, pos, text) {
    super(context, start, 1000, pos);
    this.string = text;
  }
  render() {
    console.log("render TextEvent at:", this.x, this.y);
    this.context.font = "16px Droid Sans";
    this.context.fillStyle = "orange";
    this.context.fillText(this.string, this.x, this.y);
  }
}

class Interface {
  constructor(player) {
    //this.keysDown = {};
    this.player = player;
    this.player.addUI(this);
    this.events = [];
    this.hudVisible = false;
    this.itemMenuVisible = false;

    this.hud = document.createElement("canvas");
    this.hud.style.position = 'absolute';
    this.desiredScreenWidth = TILE_SIZE * 6 * UPSCALE_FACTOR;
    this.desiredScreenHeight = TILE_SIZE * 10 * UPSCALE_FACTOR;
    this.hud.width = TILE_SIZE * 8 * UPSCALE_FACTOR;
    this.hud.height = TILE_SIZE * 10 * UPSCALE_FACTOR;
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

    document.getElementById("centre_camera").addEventListener("click", this.centreCamera.bind(this), false);
    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("hud_button").addEventListener("click", this.controlHUD.bind(this), false);
    document.getElementById("items_button").addEventListener("click", this.controlItemMenu.bind(this), false);
    document.getElementById("gameCanvas").addEventListener("click", this.onCanvasClick.bind(this), false);
  }

  addEvent(event) {
    this.events.push(event);
  }

  centreCamera(event) {
    let x = this.player.currentHero.pos.x * TILE_SIZE * UPSCALE_FACTOR;
    let y = this.player.currentHero.pos.y * TILE_SIZE * UPSCALE_FACTOR;
    x -= window.innerWidth / 2;
    y -= window.innerHeight / 2;
    window.scrollTo(x, y);
  }

  renderInfo() {
    // Draw text onto the canvas for ~1 second to inform the player of changes.
    // - chest contents
    // - exp gain
    // - level up
    for (let i in this.events) {
      let event = this.events[i];
      if (!event.isFinished()) {
        event.render();
      } else {
        this.player.game.map.setDirty(event.pos);
        let pos = new Vec(event.pos.x, event.pos.y - 1);
        this.player.game.map.setDirty(pos);
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
  }

  initMenu() {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var isSmallScreen = true; //this.desiredHUDWidth > window.innerWidth ? true : false;
    // if the screen is large, we could make the HUD two or three tiles wider.

    this.hudContext.clearRect(0, 0, this.hud.width, this.hud.height);
    this.hud.style.left = offsetX + "px";
    this.hud.style.top = offsetY + "px";

    if (window.innerWidth >= this.desiredScreenWidth) {
      this.hud.width = this.desiredScreenWidth;
      if (window.innerWidth >= this.desiredScreenWidth * 2) {
        this.hud.style.left = (window.innerWidth / 2) + offsetX + "px";
      } else {
        this.hud.style.left = (this.hud.width / 2) + offsetX + "px";
      }
    } else {
      this.hud.width = window.innerWidth;
    }

    if (window.innerHeight >= this.desiredScreenHeight) {
      this.hud.height = this.desiredScreenHeight;
      if (window.innerWidth >= this.desiredScreenWidth * 2) {
        this.hud.style.top = (window.innerHeight / 2) + offsetY + "px";
      } else {
        this.hud.style.top = (this.hud.height / 2) + offsetY + "px";
      }
    } else {
      this.hud.height = window.innerHeight;
    }
  }
  renderItemMenu() {
    this.initMenu();
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";
    let x = TILE_SIZE * UPSCALE_FACTOR;
    let y = TILE_SIZE * UPSCALE_FACTOR;
    for (let item of this.player.items.keys()) {
      let number = this.player.items.get(item);
      item.sprite.render(x, y, this.hudContext);
      this.hudContext.fillText(item.name + " : " + number, x * 2, y + TILE_SIZE * UPSCALE_FACTOR / 2);
      y += TILE_SIZE * UPSCALE_FACTOR;
    }
  }
  renderHUD() {
    if (this.hudVisible) {
      this.renderTeamMenu();
    } else if (this.itemMenuVisible) {
      this.renderItemMenu();
    }
  }

  renderTeamMenu() {
    this.initMenu();
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";

    for (let i in this.player.heroes) {
      let hero = this.player.heroes[i];
      let offsetX = TILE_SIZE * UPSCALE_FACTOR;
      let offsetY = TILE_SIZE + (TILE_SIZE * 2 * i) * UPSCALE_FACTOR;
      let spacing = (TILE_SIZE / 4) + 8;

      hero.sprite.render(offsetX, offsetY, this.hudContext);

      if (hero.weapon) {
        hero.weapon.sprite.render(offsetX + 2 * spacing, offsetY, this.hudContext);
      }
      if (hero.shield) {
        hero.shield.sprite.render(offsetX + 4 * spacing, offsetY, this.hudContext);
      }
      else if (hero.arrows) {
        hero.arrows.sprite.render(offsetX + 4 * spacing, offsetY, this.hudContext);
      }
      if (hero.armour) {
        hero.armour.sprite.render(offsetX + 6 * spacing, offsetY, this.hudContext);
      }
      if (hero.helmet) {
        hero.helmet.sprite.render(offsetX + 8 * spacing, offsetY, this.hudContext);
      }

      offsetY += TILE_SIZE * UPSCALE_FACTOR + (TILE_SIZE / 4);
      this.hudContext.fillText("Lvl: " + hero.level, offsetX, offsetY);
      this.hudContext.fillText("Exp to next Lvl: " + (hero.expToNextLvl - hero.currentExp),
                               offsetX, offsetY + spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Health: " + hero.currentHealth + "/" + hero.maxHealth,
                               offsetX, offsetY + 2 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Energy: " + hero.currentEnergy + "/" + hero.maxEnergy,
                               offsetX, offsetY + 3 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Strength: " + hero.strength,
                               offsetX, offsetY + 4 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Agility: " + hero.agility,
                               offsetX, offsetY + 5 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Wisdom: " + hero.wisdom,
                               offsetX, offsetY + 6 * spacing * UPSCALE_FACTOR);
    }
  }

  onCanvasClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE / UPSCALE_FACTOR);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE / UPSCALE_FACTOR);
    this.player.setDestination(x, y);
  }

  controlHUD(event) {
    if (!this.hudVisible) {
      this.hud.style.visibility = 'visible';
      this.hudVisible = true;
      this.itemMenuVisible = false;
    } else {
      this.hud.style.visibility = 'hidden';
      this.hudVisible = false;
    }
  }

  controlItemMenu(event) {
    if (!this.itemMenuVisible) {
      this.hud.style.visibility = 'visible';
      this.itemMenuVisible = true;
      this.hudVisible = false;
    } else {
      this.hud.style.visibility = 'hidden';
      this.itemMenuVisible = false;
    }
  }
}
