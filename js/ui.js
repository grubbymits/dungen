"use strict";

class Interface {
  constructor(game) {
    //this.keysDown = {};
    this.game = game;
    this.events = [];
    this.menuEvents = [];

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
      text = "  Level: " + hero.level + "\n" +
             "  Exp: " + hero.currentExp + "\n" +
             "  Exp to next level: " + (hero.expToNextLvl - hero.currentExp) + "\n" +
             "  - - - - - - - - - - - - - - - - - - - - -\n" +
             "  Health: " + hero.currentHealth + "/" + hero.maxHealth + "\n" +
             "  Energy: " + hero.currentEnergy + "/" + hero.maxEnergy + "\n" +
             "  Attack Energy: " + hero.primaryAtkEnergy + "\n" +
             "  Attack: " + hero.primaryAtkPower + "\n" +
             "  Defense: " + hero.physicalDefense + "\n" +
             "  Magic Resistance: " + hero.magicResistance + "\n" +
             "  - - - - - - - - - - - - - - - - - - - - -\n";
    }
    text += "  Strength: " + hero.strength + "\n" +
            "  Endurance: " + hero.endurance + "\n" +
            "  Agility: " + hero.agility + "\n" +
            "  Wisdom: " + hero.wisdom + "\n" +
            "  Will: " + hero.will + "\n" +
            "  - - - - - - - - - - - - - - - - - - - - -\n";
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
    //this.events.push(new TextEvent(hero.name + " joins the team"));
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
    window.scrollTo(x, y);
  }

  renderInfo() {
    let game = this.player.game;
    for (let i in this.events) {
      let event = this.events[i];

      if (!event.isFinished()) {
        event.update();
      } else {
        event.end(game);
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }

    for (let i in this.menuEvents) {
      let event = this.menuEvents[i];
      if (event.active && !event.finished) {
        break;
      }
      if (!event.active && !event.finished) {
        event.begin();
        break;
      } else if (event.finished) {
        delete this.menuEvents[i];
        this.menuEvents.splice(i, 1);
      }
    }
  }

  levelUp(hero) {
    //this.events.push(new TextEvent(hero.name + " lvl up!"));
    this.menuEvents.push(new LevelUpEvent(this, hero));
  }

  gameOver() {
    this.menuEvents.push(new GameOverEvent(this.player.currentHero));
  }

  updateStats(hero) {
    this.drawStats(hero, '#stats', true);
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
