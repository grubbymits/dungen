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
    this.context.font = "16px Droid Sans";
    this.context.fillStyle = "orange";
    this.context.fillText(this.string, this.x, this.y);
  }
}

class Interface {
  constructor(player) {
    //this.keysDown = {};
    this.game = player.game;
    this.player = player;
    this.player.addUI(this);
    this.heroToLevelUp = null;
    this.events = [];
    this.hudVisible = false;
    this.itemMenuVisible = false;
    this.state = { menu: STATS,
                   hero: this.player.currentHero,
                   itemType: ARMOUR,
                   items: [] };

    this.hud = document.createElement("canvas");
    this.hud.style.position = 'fixed';
    this.hud.width = TILE_SIZE * 5 * UPSCALE_FACTOR;
    this.hud.height = TILE_SIZE * 11 * UPSCALE_FACTOR;
    this.hud.style.left = '0px';
    this.hud.style.top = '0px';
    this.hud.style.visibility = 'hidden';
    this.hud.style.background = "rgba(50, 75, 75, 0.7)";
    document.body.appendChild(this.hud);
    this.hudContext = this.hud.getContext("2d");
    this.lvlUpButtons = document.getElementById("levelUpButtons");

    document.getElementById("centre_camera").addEventListener("click", this.centreCamera.bind(this), false);
    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("hud_button").addEventListener("click", this.controlHUD.bind(this), false);
    document.getElementById("gameCanvas").addEventListener("click", this.onCanvasClick.bind(this), false);

    document.getElementById("wisdom").addEventListener("click", this.increaseWisdom.bind(this), false);
    document.getElementById("agility").addEventListener("click", this.increaseAgility.bind(this), false);
    document.getElementById("strength").addEventListener("click", this.increaseStrength.bind(this), false);

    this.hud.addEventListener("click", this.controller.bind(this), false);

    this.stats = document.createElement("canvas");
    this.stats.style.position = "fixed";
    this.stats.style.left = '0px';
    this.stats.style.bottom = '0px';
    this.stats.style.visibility = 'visible';
    this.stats.style.zIndex = '4';
    this.stats.style.background = "rgba(50, 75, 75, 0.7)";
    this.stats.width = 3 * TILE_SIZE;
    this.stats.height = TILE_SIZE;
    document.body.appendChild(this.stats);
    this.statsContext = this.stats.getContext("2d");
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
        let pos = new Vec(event.pos.x - 1, event.pos.y - 1);
        this.player.game.map.setDirty(pos);
        pos.x++;
        this.player.game.map.setDirty(pos);
        pos.x++;
        this.player.game.map.setDirty(pos);
        pos.x++;
        this.player.game.map.setDirty(pos);
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
  }

  levelUp(hero) {
    this.lvlUpButtons.style.visibility = "visible";
    this.heroToLevelUp = hero;
    //let strength = document.getElementById("strength");
    //strength.style.left = window.innerWidth / 2 + "px";
    //strength.disabled = false;
  }
  increaseAgility() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.agility++;
      this.lvlUpButtons.style.visibility = "hidden";
    }
  }
  increaseStrength() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.strength++;
      this.lvlUpButtons.style.visibility = "hidden";
    }
  }
  increaseWisdom() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.wisdom++;
      this.lvlUpButtons.style.visibility = "hidden";
    }
  }
  getItems(type) {
    switch(type) {
      default:
      console.error("unhandled item type:", type);
      break;
      case ARMOUR:
      return this.player.armours;
      case HELMET:
      return this.player.helmets;
      case SHIELD:
      return this.player.shields;
      case SWORD:
      return this.player.swords;
      case STAFF:
      return this.player.staffs;
      case AXE:
      return this.player.axes;
    }
  }
  controller(event) {
    let x = Math.floor(event.clientX / TILE_SIZE);
    let y = Math.floor(event.clientY / TILE_SIZE);
    if (x == 0 && y == 0) {
      // Choose character
      this.state.menu = TEAM;
    } else if (y == 0 && x > 0 && x < 5) {
      // Whatever state the UI is in, if the items are clicked
      // at the top, the equip menu for that item type needs
      // to be presented.
      if (x == 1) {
        this.state.itemType = this.state.hero.primary.type;
      } else if (x == 2) {
        this.state.itemType = this.state.hero.secondary.type;
      } else if (x == 3) {
        this.state.itemType = ARMOUR;
      } else if (x == 4) {
        this.state.itemType = HELMET;
      } else {
        console.error("unhandled item type");
      }
      this.renderEquipMenu();
    } else if (this.state.menu == EQUIP && y > 2) {
      // The item list begins at y == 3 and will contain a maximum of
      // 8 elements / rows.
      if (y < this.state.items.length + 2) {
        let item = this.state.items[y-2];
        this.state.hero.equipItem(item);
      }
    }
  }
  renderEquipMenu() {
    this.state.menu = EQUIP;
    this.state.items = [];
    let x = 0; //TILE_SIZE * UPSCALE_FACTOR;
    let y = 2 * TILE_SIZE * UPSCALE_FACTOR;
    this.hudContext.clearRect(x, y, this.hud.width, this.hud.height);
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";

    let items = this.getItems(this.state.itemType);
    for (let item of items.keys()) {
      let number = items.get(item);
      item.sprite.render(x, y, this.hudContext);
      this.hudContext.fillText(item.name + " : " + number, TILE_SIZE, y + TILE_SIZE * UPSCALE_FACTOR / 2);
      y += TILE_SIZE * UPSCALE_FACTOR;
      this.state.items.push(item);
    }
  }
  renderTeamList() {
    
  }
  renderCurrentCharacter() {
    this.hudContext.clearRect(0, 0, this.hud.width, 3 * TILE_SIZE);
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";
    let hero = this.state.hero;
    let offsetX = 0; //TILE_SIZE * UPSCALE_FACTOR;
    let offsetY = 0; //TILE_SIZE * 1 * UPSCALE_FACTOR;
    let spacing = TILE_SIZE;
    hero.sprite.render(offsetX, offsetY, this.hudContext);
    hero.primary.sprite.render(offsetX + 1 * spacing, offsetY, this.hudContext);
    hero.secondary.sprite.render(offsetX + 2 * spacing, offsetY, this.hudContext);
    hero.armour.sprite.render(offsetX + 3 * spacing, offsetY, this.hudContext);
    if (hero.helmet) {
      hero.helmet.sprite.render(offsetX + 4 * spacing, offsetY, this.hudContext);
    }
  }
  renderCurrentStats() {
    let offsetX = TILE_SIZE / 4; //* UPSCALE_FACTOR;
    let offsetY = 2 * TILE_SIZE * UPSCALE_FACTOR;
    let spacing = TILE_SIZE;
    let hero = this.state.hero;
    
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";
    
    this.hudContext.clearRect(0, offsetY, this.hud.width, this.hud.height);
    this.hudContext.fillText("Lvl: " + hero.level, offsetX, offsetY);
    this.hudContext.fillText("Exp to next Lvl: " + (hero.expToNextLvl - hero.currentExp),
                               offsetX, offsetY + spacing * UPSCALE_FACTOR / 2);
    this.hudContext.fillText("Health: " + hero.currentHealth + "/" + hero.maxHealth,
                               offsetX, offsetY + spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Energy: " + hero.currentEnergy + "/" + hero.maxEnergy,
                               offsetX, offsetY + 3/2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Strength: " + hero.strength,
                               offsetX, offsetY + 2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Agility: " + hero.agility,
                               offsetX, offsetY + 5/2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Wisdom: " + hero.wisdom,
                               offsetX, offsetY + 3 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Attack: " + hero.meleeAtkPower,
                               offsetX, offsetY + 7/2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Defense: " + hero.physicalDefense,
                               offsetX, offsetY + 4 * spacing * UPSCALE_FACTOR);
  }
  renderHUD() {
    if (this.hudVisible) {
      this.renderCurrentCharacter();
      switch(this.state.menu) {
        case STATS:
        case TEAM:
          this.renderCurrentStats();
          break;
        case EQUIP:
          this.renderEquipMenu();
          break;
      }
    }
    let hero = this.player.currentHero;
    this.statsContext.clearRect(0, 0, this.stats.width, this.stats.height);
    this.statsContext.font = "16px Droid Sans";
    this.statsContext.fillStyle = "orange";
    this.statsContext.textAlign = "center";
    this.statsContext.fillText("HP: " + hero.currentHealth + "/" + hero.maxHealth,
                               48, 32);
    this.statsContext.fillText("EP: " + hero.currentEnergy + "/" + hero.maxEnergy,
                               128, 32);

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
