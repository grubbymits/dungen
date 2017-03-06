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

  end(game) { }
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

  end(game) {
    game.map.setDirty(this.position);
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

  end(game) {
    for (let node of this.path) {
      game.map.setDirty(node);
      // clean up diagonal artifacts
      game.map.setDirty(new Vec(node.x - 1, node.y));
      game.map.setDirty(new Vec(node.x + 1, node.y));
    }
  }
}

class LevelUpEvent {
  constructor(UI, hero) {
    this.UI = UI;
    this.hero = hero;
    this.finished = false;
    this.active = false;
    console.log("create LvlUpEvent for:", hero.name);
  }

  begin() {
    $("#increase_strength").on('click', { lvlup : this },
    function(event) {
      if (event.data.lvlup.finished) {
        return;
      }
      event.data.lvlup.hero.strength++;
      event.data.lvlup.UI.drawStats(event.data.lvlup.hero, '#stats', true);
      $('#lvl_up_menu').css("visibility", "hidden");
      event.data.lvlup.finished = true;
    });
    $("#increase_endurance").on('click', { lvlup : this },
    function(event) {
      if (event.data.lvlup.finished) {
        return;
      }
      event.data.lvlup.hero.endurance++;
      event.data.lvlup.UI.drawStats(event.data.lvlup.hero, '#stats', true);
      $('#lvl_up_menu').css("visibility", "hidden");
      event.data.lvlup.finished = true;
    });
    $("#increase_agility").on('click', { lvlup : this },
    function(event) {
      if (event.data.lvlup.finished) {
        return;
      }
      event.data.lvlup.hero.agility++;
      event.data.lvlup.UI.drawStats(event.data.lvlup.hero, '#stats', true);
      $('#lvl_up_menu').css("visibility", "hidden");
      event.data.lvlup.finished = true;
    });
    $("#increase_will").on('click', { lvlup : this },
    function(event) {
      if (event.data.lvlup.finished) {
        return;
      }
      event.data.lvlup.hero.will++;
      event.data.lvlup.UI.drawStats(event.data.lvlup.hero, '#stats', true);
      $('#lvl_up_menu').css("visibility", "hidden");
      event.data.lvlup.finished = true;
    });
    $("#increase_wisdom").on('click', { lvlup : this },
    function(event) {
      if (event.data.lvlup.finished) {
        return;
      }
      event.data.lvlup.hero.wisdom++;
      event.data.lvlup.UI.drawStats(event.data.lvlup.hero, '#stats', true);
      $('#lvl_up_menu').css("visibility", "hidden");
      event.data.lvlup.finished = true;
    });

    this.active = true;
    console.log("beginning LvlUpEvent for:", this.hero.name);
    $('#lvl_up_hero_icon').removeClass();
    $('#lvl_up_hero_icon').addClass(this.hero.className);
    this.UI.drawStats(this.hero, '#lvl_up_stats', false);
    $('#lvl_up_menu').css("visibility", "visible");
  }
}

class Interface {
  constructor(game) {
    //this.keysDown = {};
    this.game = game; //player.game;
    //this.player = player;
    //this.player.addUI(this);
    this.events = [];
    this.LvlUpEvents = [];

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
      .addEventListener("click", event => this.player.setRest());
    document.getElementById("heal_button")
      .addEventListener("click", event => this.player.healHero());
    document.getElementById("mapCanvas")
      .addEventListener("click", this.onCanvasClick.bind(this), false);

    $('#group_button').on('click', { ui : this },
    function(event) {
      let player = event.data.ui.player;
      if (player.hasGroupControl) {
        player.hasGroupControl = false;
        event.data.ui.events.push(new TextEvent("Individual controls enabled"));
      } else {
        player.hasGroupControl = true;
        event.data.ui.events.push(new TextEvent("Individual controls disabled"));
      }
    });
  }

  init(player) {
    this.player = player;
  }

  drawEquipment(hero) {
    console.log("drawEquipment for:", hero);
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

  drawStats(hero, field, writeAll) {
    let text = "";
    // Populate hero stats
    if (writeAll) {
      text = "  Health: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
             "  Energy: " + hero.currentEnergy + "/" + hero.maxEnergy + "\n" +
             "  Attack Energy: " + hero.primaryAtkEnergy + "\n" +
             "  Attack: " + hero.primaryAtkPower + "\n" +
             "  Defense: " + hero.physicalDefense + "\n";
    }
    text += "  Strength: " + hero.strength + "\n" +
            "  Endurance: " + hero.endurance + "\n" +
            "  Agility: " + hero.agility + "\n" +
            "  Wisdom: " + hero.wisdom + "\n" +
            "  Will: " + hero.will + "\n";
    $(field).text(text);
  }


  populatePrimaryList(hero) {
    $('#equipment_list').append(
      '<li><div class="collapsible-header" id="primary_equipment">Primary</div></li>');
    let items = this.getItems(hero.primary.type);
    for (let item of items.keys()) {

      let string = item.name + ", ATK: " + item.power + ", RNG: " + item.range;
      $('<div class="collapsible-body">' +
        '<a class="waves-effect btn orange" style="margin:2px"</a>' + string + '</div>')
      .insertAfter('#primary_equipment').on('click', { ui : this },
      function(event) {
        hero.equipItem(item);
        event.data.ui.drawEquipment(hero);
        event.data.ui.drawStats(hero, '#stats', true);
      });
    }
  }

  populateSecondaryList(hero) {
    $('#equipment_list').append(
      '<li><div class="collapsible-header" id="secondary_equipment">Secondary</div></li>');

    let items = this.getItems(hero.secondary.type);
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
        '<a class="waves-effect btn orange" style="margin:2px"</a>' + string + '</div>')
        .insertAfter('#secondary_equipment').on('click', { ui : this },
        function(event) {
          hero.equipItem(item);
          event.data.ui.drawEquipment(hero);
          event.data.ui.drawStats(hero, '#stats', true);
        });
    }
  }

  populateHeadList(hero) {
    $('#equipment_list').append(
      '<li><div class="collapsible-header" id="head_equipment">Head Gear</div></li>');
    let items = this.getItems(HELMET);
    for (let item of items.keys()) {

      let string = item.name + ", DEF: " + item.defense;
      $('<div class="collapsible-body">' +
        '<a class="waves-effect btn orange" style="margin:2px"</a>' + string + '</div>')
      .insertAfter('#head_equipment').on('click', { ui : this },
        function(event) {
          hero.equipItem(item);
          event.data.ui.drawEquipment(hero);
          event.data.ui.drawStats(hero, '#stats', true);
        });
    }
  }

  populateArmourList(hero) {
    $('#equipment_list').append(
      '<li><div class="collapsible-header" id="body_equipment">Body Armour</div></li>');
    let items = this.getItems(ARMOUR);
    for (let item of items.keys()) {

      let string = item.name + ", DEF: " + item.defense;
      $('<div class="collapsible-body">' +
        '<a class="waves-effect btn orange" style="margin:2px"</a>' + string + '</div>')
      .insertAfter('#body_equipment').on('click', { ui : this },
        function(event) {
          hero.equipItem(item);
          event.data.ui.drawEquipment(hero);
          event.data.ui.drawStats(hero, '#stats', true);
        });
    }
  }

  refreshEquipmentLists(hero) {
    // Clear and repopulate equipment lists
    $('#equipment_list').empty();
    this.populatePrimaryList(hero);
    this.populateSecondaryList(hero);
    this.populateHeadList(hero);
    this.populateArmourList(hero);
  }

  addHero(hero) {
    this.events.push(new TextEvent(hero.name + " joins the team"));
    // Add a button for the new hero
    let name = hero.className;
    let id = name + '_id';
    var new_btn = $('<li><a class="waves-effect btn orange" style="margin:2px id="'
                    + id + '">' + name +'</a></li>')
      .on('click', { ui : this }, function(event) {

      $('#hero_icon').removeClass();
      $('#hero_icon').addClass(name);

      event.data.ui.drawEquipment(hero);
      event.data.ui.drawStats(hero, '#stats', true);
      event.data.ui.refreshEquipmentLists(hero);
    });

    $('#hero_list ul').append(new_btn);

    // ensure the collapsible ability is enabled.
    $('#collapsible_heroes').collapsible();
    $('#equipment_list').collapsible();

  }

  initNav(hero) {
    console.log(hero);
    // Initialise Nav
    $('#hero_icon').addClass(hero.className);
    this.drawEquipment(hero);
    this.drawStats(hero, '#stats', true);
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
        } else {
          event.render();
        }
      } else {
        event.end(game);
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }

    for (let i in this.LvlUpEvents) {
      let event = this.LvlUpEvents[i];
      if (event.active && !event.finished) {
        break;
      }
      if (!event.active && !event.finished) {
        event.begin();
        break;
      } else if (event.finished) {
        delete this.LvlUpEvents[i];
        this.LvlUpEvents.splice(i, 1);
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
    this.events.push(new TextEvent(hero.name + " lvl up!"));
    this.LvlUpEvents.push(new LevelUpEvent(this, hero));
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
