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

class AnimationEvent extends GraphicEvent {
  constructor(context, pos, dest, sprite) {
    super(context, pos, sprite);
    this.diffX = dest.x - pos.x;
    this.diffY = dest.y - pos.y; 
  }

  render() {
    this.x += this.diffX;
    this.y += this.diffY;
    this.sprite.render(this.x, this. y, this.context);
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
