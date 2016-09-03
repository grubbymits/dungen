"use strict";

class UIEvent {
  constructor(context, start, millisecs, pos) {
    this.context = context;
    this.startTime = start;
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

class GraphicEvent extends UIEvent {
  constructor(context, start, pos, sprite) {
    super(context, start, 1000, pos);
    this.sprite = sprite;
  }
  render() {
    this.sprite.render(this.x, this.y, this.context);
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
    //this.hudContext = this.hud.getContext("2d");
    this.lvlUpButtons = document.getElementById("levelUpButtons");

    document.getElementById("centre_camera").addEventListener("click", this.centreCamera.bind(this), false);
    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("heal_button").addEventListener("click", event => player.healHero());
    //document.getElementById("hud_button").addEventListener("click", this.controlHUD.bind(this), false);
    document.getElementById("mapCanvas").addEventListener("click", this.onCanvasClick.bind(this), false);

    document.getElementById("wisdom").addEventListener("click", this.increaseWisdom.bind(this), false);
    document.getElementById("agility").addEventListener("click", this.increaseAgility.bind(this), false);
    document.getElementById("strength").addEventListener("click", this.increaseStrength.bind(this), false);

    this.setupNav();
  }

  drawEquipment(hero) {
    // Draw hero icon and the current equipment
    let primaryPos = "-" + hero.primary.sprite.offsetX + "px -" + hero.primary.sprite.offsetY + "px";
    let secondaryPos = "-" + hero.secondary.sprite.offsetX + "px -" + hero.secondary.sprite.offsetY + "px";
    let headPos = "-" + hero.helmet.sprite.offsetX + "px -" + hero.helmet.sprite.offsetY + "px";
    let bodyPos = "-" + hero.armour.sprite.offsetX + "px -" + hero.armour.sprite.offsetY + "px";
    console.log("primary = ", hero.primary, "position =", primaryPos);
    $('#primary_icon').css("object-position", "");
    $('#primary_icon').css("object-position", primaryPos);
    $('#secondary_icon').css("object-position", secondaryPos);
    $('#head_icon').css("object-position", headPos);
    $('#body_icon').css("object-position", bodyPos);
  }

  drawStats(hero) {
        // Populate hero stats
        $('#stats').text("  Health: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
                         "  Energy: " + hero.currentEnergy + "/" + hero.maxEnergy + "\n" +
                         "  Strength: " + hero.strength + "\n" +
                         "  Endurance: " + hero.endurance + "\n" +
                         "  Agility: " + hero.agility + "\n" +
                         "  Wisdom: " + hero.wisdom + "\n" +
                         "  Will: " + hero.will + "\n" +
                         "  Attack: " + hero.primaryAtkPower + "\n" +
                         "  Attack Energy: " + hero.primaryAtkEnergy + "\n" +
                         "  Defense: " + hero.physicalDefense + "\n" +
                         "  Exp to next lvl: " + hero.expToNextLvl);
  }

  setupNav() {
    for (let hero of this.player.heroes) {
      let name = 'knight';
      if (hero.subtype == MAGE)
        name = 'mage';
      else if (hero.subtype == ROGUE)
        name = 'rogue';
      else if (hero.subtype == ARCHER)
        name = 'archer';

      let id = name + '_id';
      $('<div class="collapsible-body">' +
          '<a class="waves-effect btn orange" style="margin:2px id="' + id + '"">'
            + name +'</a></div>').insertAfter('#hero_list');

      // Setup stats display
      $('#collapsible_heroes').on('click', { ui : this }, function(event) {

        $('#hero_icon').removeClass();
        $('#hero_icon').addClass(name);

        event.data.ui.drawEquipment(hero);
        event.data.ui.drawStats(hero);

        // Populate primary equipment list
        $('#equipment_list').empty();
        $('#equipment_list').append(
          '<li><div class="collapsible-header" id="primary_equipment">Primary</div></li>');

        let items = event.data.ui.getItems(hero.primary.type);
        for (let item of items.keys()) {

          let string = item.name + ", ATK: " + item.power + ", RNG: " + item.range;
          $('<div class="collapsible-body">' +
            '<a class="waves-effect btn orange" style="margin:2px"</a>' +
            string + '</div>').insertAfter('#primary_equipment').on('click',
                                              { ui : event.data.ui },
            function(event) {
              hero.equipItem(item);
              event.data.ui.drawEquipment(hero);
              event.data.ui.drawStats(hero);
            });
        }
        $('#equipment_list').append(
          '<li><div class="collapsible-header" id="secondary_equipment">Secondary</div></li>');

        items = event.data.ui.getItems(hero.secondary.type);
        for (let item of items.keys()) {

          let string = item.name;
          if (item.type == THROWING)
            string += ", ATK: " + item.power + ", RNG: " + item.range;
          else if (item.type == ARROWS)
            string += ", ATK: " + item.power;
          else if (item.type == SHIELD)
            string += ", DEF: " + item.defense;
          else
            console.log("unhandled item type!");

          $('<div class="collapsible-body">' +
            '<a class="waves-effect btn orange" style="margin:2px"</a>' +
            string + '</div>').insertAfter('#secondary_equipment').on('click',
                                              { ui : event.data.ui },
            function(event) {
              hero.equipItem(item);
              event.data.ui.drawEquipment(hero);
              event.data.ui.drawStats(hero);
            });
        }

        // Populate the head gear drop down
        $('#equipment_list').append(
          '<li><div class="collapsible-header" id="head_equipment">Head Gear</div></li>');
        items = event.data.ui.getItems(HELMET);
        for (let item of items.keys()) {

          let string = item.name + ", DEF: " + item.defense;
          $('<div class="collapsible-body">' +
            '<a class="waves-effect btn orange" style="margin:2px"</a>' +
            string + '</div>').insertAfter('#head_equipment').on('click',
                                              { ui : event.data.ui },
            function(event) {
              hero.equipItem(item);
              event.data.ui.drawEquipment(hero);
              event.data.ui.drawStats(hero);
            });
        }

        // Populate the armour drop down
        $('#equipment_list').append(
          '<li><div class="collapsible-header" id="body_equipment">Body Armour</div></li>');
        items = event.data.ui.getItems(ARMOUR);
        for (let item of items.keys()) {

          let string = item.name + ", DEF: " + item.defense;
          $('<div class="collapsible-body">' +
            '<a class="waves-effect btn orange" style="margin:2px"</a>' +
            string + '</div>').insertAfter('#body_equipment').on('click',
                                              { ui : event.data.ui },
            function(event) {
              hero.equipItem(item);
              event.data.ui.drawEquipment(hero);
              event.data.ui.drawStats(hero);
            });
        }
      });
    }
    // ensure the collapsible ability is enabled.
    $('#collapsible_heroes').collapsible();
    $('#equipment_list').collapsible();
  }
  
  addEvent(event) {
    this.events.push(event);
  }

  centreCamera(event) {
    let x = this.player.currentHero.pos.x * TILE_SIZE * UPSCALE_FACTOR;
    let y = this.player.currentHero.pos.y * TILE_SIZE * UPSCALE_FACTOR;
    x -= window.innerWidth / 2;
    y -= window.innerHeight / 2;
    console.log("centreCamera to", x, y);
    window.scrollTo(x, y);
  }

  renderInfo() {
    let game = this.player.game;
    // Draw text onto the canvas for ~1 second to inform the player of changes.
    // - chest contents
    // - exp gain
    // - level up
    for (let i in this.events) {
      let event = this.events[i];
      if (!event.isFinished()) {
        event.render();
      } else {
        game.map.setDirty(event.pos);
        let pos = new Vec(event.pos.x - 1, event.pos.y - 1);
        game.map.setDirty(pos);
        pos.x++;
        game.map.setDirty(pos);
        pos.x++;
        game.map.setDirty(pos);
        pos.x++;
        game.map.setDirty(pos);
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
    
    let hero = this.player.currentHero;
    currentHeroSprite.render(hero.pos.x * TILE_SIZE,
                             hero.pos.y * TILE_SIZE,
                             this.game.overlayContext);
                             
    $('#hero_hud').text("HP: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
                        "EP: " + hero.currentEnergy + "/" + hero.maxEnergy);
    $('#score_hud').text("Chests: " + game.openChests +"/" + game.totalChests + "\n" +
                         "Killed: " + game.monstersKilled + "/" + game.totalMonsters + "\n" +
                         "Exp: " + game.expGained);
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
      case THROWING:
        return this.player.throwing;
      case BOW:
        return this.player.bows;
      case ARROWS:
        return this.player.arrows;
      case SPELL:
        return this.player.spells;
    }
  }
  
  renderLevelUpMenu() {
    this.state.menu = LVL_UP;
    renderCurrentCharacter();
    let hero = this.state.hero;
    
    this.hudContext.fillText("Strength: " + hero.strength,
                               offsetX, offsetY + 2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Endurance: " + hero.endurance,
                               offsetX, offsetY + 5/2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Agility: " + hero.agility,
                               offsetX, offsetY + 3 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Wisdom: " + hero.wisdom,
                               offsetX, offsetY + 7/2 * spacing * UPSCALE_FACTOR);
    this.hudContext.fillText("Will: " + hero.will,
                               offsetX, offsetY + 4 * spacing * UPSCALE_FACTOR);
  }
  
  onCanvasClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE / UPSCALE_FACTOR);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE / UPSCALE_FACTOR);
    this.player.setDestination(x, y);
  }
}
