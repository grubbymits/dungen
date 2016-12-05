"use strict";

const TEXT_EVENT = 0;
const GRAPHIC_EVENT = 1;
const PATH_EVENT = 2;

class UIEvent {
  constructor(millisecs) {
    this.startTime = new Date().getTime();
    this.endTime = this.startTime + millisecs;
  }

  isFinished() {
    return (new Date().getTime() >= this.endTime);
  }
}

class TextEvent extends UIEvent {
  constructor(text) {
    super(3000);
    this.string = text;
    this.type = TEXT_EVENT;
  }
}

class GraphicEvent extends UIEvent {
  constructor(context, pos, sprite) {
    super(1000);
    this.sprite = sprite;
    this.context = context;
    this.position = pos;
    this.x = pos.x * TILE_SIZE * UPSCALE_FACTOR;
    this.y = pos.y * TILE_SIZE * UPSCALE_FACTOR;
    this.type = GRAPHIC_EVENT;
  }

  get pos() {
    return this.position;
  }

  render() {
    this.sprite.render(this.x, this.y, this.context);
  }
}

class PathEvent extends UIEvent {
  constructor(context, path) {
    super(1000);
    this.context = context;
    this.path = path;
    this.type = PATH_EVENT;
  }

  render() {
    if (this.path.length === 0)
      return;
    // draw a line between each location of the path
    let src = this.path[0];
    this.context.strokeStyle = "orange";
    this.context.beginPath();
    this.context.moveTo(src.x * TILE_SIZE + (TILE_SIZE / 2),
                        src.y * TILE_SIZE + (TILE_SIZE / 2));
    for (let i = 1; i < this.path.length; ++i) {
      let dest = this.path[i];
      this.context.lineTo(dest.x * TILE_SIZE + (TILE_SIZE / 2),
                          dest.y * TILE_SIZE + (TILE_SIZE / 2));
    }
    this.context.stroke();
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

    document.getElementById("centre_camera")
      .addEventListener("click", this.centreCamera.bind(this), false);
    document.getElementById("rest_button")
      .addEventListener("click", event => player.setRest());
    document.getElementById("heal_button")
      .addEventListener("click", event => player.healHero());
    document.getElementById("mapCanvas")
      .addEventListener("click", this.onCanvasClick.bind(this), false);

    // Links for level up menu
    document.getElementById("increase_strength")
      .addEventListener("click", this.increaseStrength.bind(this), false);
    document.getElementById("increase_endurance")
      .addEventListener("click", this.increaseEndurance.bind(this), false);
    document.getElementById("increase_agility")
      .addEventListener("click", this.increaseAgility.bind(this), false);
    document.getElementById("increase_will")
      .addEventListener("click", this.increaseWill.bind(this), false);
    document.getElementById("increase_wisdom")
      .addEventListener("click", this.increaseWisdom.bind(this), false);

    this.setupNav();
  }

  drawEquipment(hero) {
    // Draw hero icon and the current equipment
    let primaryPos = "-" + hero.primary.sprite.offsetX + "px -"
      + hero.primary.sprite.offsetY + "px";
    let secondaryPos = "-" + hero.secondary.sprite.offsetX + "px -"
      + hero.secondary.sprite.offsetY + "px";
    let headPos = "-" + hero.helmet.sprite.offsetX + "px -"
      + hero.helmet.sprite.offsetY + "px";
    let bodyPos = "-" + hero.armour.sprite.offsetX + "px -"
      + hero.armour.sprite.offsetY + "px";

    $('#primary_icon').css("object-position", primaryPos);
    $('#secondary_icon').css("object-position", secondaryPos);
    $('#head_icon').css("object-position", headPos);
    $('#body_icon').css("object-position", bodyPos);
  }

  drawStats(hero, field) {
    // Populate hero stats
    $(field).text("  Health: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
                  "  Energy: " + hero.currentEnergy + "/" + hero.maxEnergy + "\n" +
                  "  Strength: " + hero.strength + "\n" +
                  "  Endurance: " + hero.endurance + "\n" +
                  "  Agility: " + hero.agility + "\n" +
                  "  Wisdom: " + hero.wisdom + "\n" +
                  "  Will: " + hero.will + "\n" +
                  "  Attack: " + hero.primaryAtkPower + "\n" +
                  "  Attack Energy: " + hero.primaryAtkEnergy + "\n" +
                  "  Defense: " + hero.physicalDefense);
  }

  drawLevelUp(hero) {
    $('#lvl_up_hero_icon').removeClass();
    $('#lvl_up_hero_icon').addClass(hero.className);
    this.drawStats(hero, '#lvl_up_stats');
    $('#lvl_up_menu').css("visibility", "visible");
  }

  setupNav() {
    for (let hero of this.player.heroes) {
      let name = hero.className;
      let id = name + '_id';
      $('<div class="collapsible-body">' +
          '<a class="waves-effect btn orange" style="margin:2px id="' + id + '"">'
            + name +'</a></div>').insertAfter('#hero_list');

      // Setup stats display
      $('#collapsible_heroes').on('click', { ui : this }, function(event) {

        $('#hero_icon').removeClass();
        $('#hero_icon').addClass(name);

        event.data.ui.drawEquipment(hero);
        event.data.ui.drawStats(hero, '#stats');

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

    // Initialise
    $('#hero_icon').addClass(this.player.currentHero.className);
    this.drawEquipment(this.player.currentHero);
    this.drawStats(this.player.currentHero);
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
    let eventList = "";
    for (let i in this.events) {
      let event = this.events[i];

      if (!event.isFinished()) {
        if (event.type == TEXT_EVENT) {
          eventList += event.string + "\n";
        } else if (event.type == GRAPHIC_EVENT) {
          event.render();
          game.map.setDirty(event.pos);
        } else if (event.type == PATH_EVENT) {
          event.render();
          for (let node of event.path) {
            game.map.setDirty(node);
            // clean up diagonal artifacts
            game.map.setDirty(new Vec(node.x - 1, node.y));
            game.map.setDirty(new Vec(node.x + 1, node.y));
          }
        }
      } else {
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
    let hero = this.player.currentHero;
    $('#hero_hud').text("HP: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
                        "EP: " + hero.currentEnergy + "/" + hero.maxEnergy);
    $('#score_hud').text("Chests: " + game.openChests +"/" + game.totalChests + "\n" +
                         "Killed: " + game.monstersKilled + "/" + game.totalMonsters + "\n" +
                         "Exp: " + game.expGained);
    $('#action_hud').text(eventList);
  }

  levelUp(hero) {
    this.heroToLevelUp = hero;
    this.drawLevelUp(hero);
  }

  increaseAgility() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.agility++;
      $('#lvl_up_menu').css("visibility", "hidden");
      this.drawStats(this.heroToLevelUp, '#stats');
    }
  }

  increaseStrength() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.strength++;
      $('#lvl_up_menu').css("visibility", "hidden");
      this.drawStats(this.heroToLevelUp, '#stats');
    }
  }

  increaseEndurance() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.endurance++;
      $('#lvl_up_menu').css("visibility", "hidden");
      this.drawStats(this.heroToLevelUp, '#stats');
    }
  }

  increaseWisdom() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.wisdom++;
      $('#lvl_up_menu').css("visibility", "hidden");
      this.drawStats(this.heroToLevelUp, '#stats');
    }
  }

  increaseWill() {
    if (this.heroToLevelUp !== null) {
      this.heroToLevelUp.will++;
      $('#lvl_up_menu').css("visibility", "hidden");
      this.drawStats(this.heroToLevelUp, '#stats');
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
  
  onCanvasClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE / UPSCALE_FACTOR);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE / UPSCALE_FACTOR);
    this.player.setDestination(x, y);
  }
}
