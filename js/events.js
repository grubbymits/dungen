"use strict";

const TEXT_EVENT = 0;
const GRAPHIC_EVENT = 1;
const PATH_EVENT = 2;
const ANIMATION_EVENT = 3;

class Event {
  constructor(millisecs) {
    this.startTime = Date.now(); //new Date().getTime();
    this.endTime = this.startTime + millisecs;
  }

  isFinished() {
    return (new Date().getTime() >= this.endTime);
  }

  update() { }

  end(game) { }
}

class TextEvent extends Event {
  constructor(text) {
    super(3000);
    this.string = text;
    this.type = TEXT_EVENT;
  }
}

class GraphicEvent extends Event {
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

  update() {
    this.sprite.render(this.x, this.y, this.context);
  }

  end(game) {
    game.map.setDirty(this.position);
  }
}

class SpriteChangeEvent extends Event {
  constructor(actor, sprite) {
    super(1000);
    this.actor = actor;
    this.sprite = sprite;
  }

  update() {
    this.actor.currentSprite = this.sprite;
  }

  end(game) {
    this.actor.currentSprite = this.actor.sprite;
  }
}

class AnimationEvent extends Event {
  constructor(actor, pos, dest, map) {
    super(1000);
    this.actor = actor;
    this.type = ANIMATION_EVENT;
    this.startPos = pos;
    this.endPos = dest;
    this.actor.drawX = pos.x * TILE_SIZE;
    this.actor.drawY = pos.y * TILE_SIZE;
    this.x = this.actor.drawX;
    this.y = this.actor.drawY;
    this.map = map;
    this.diffX = (dest.x - pos.x) * TILE_SIZE / (this.endTime - this.startTime); 
    this.diffY = (dest.y - pos.y) * TILE_SIZE / (this.endTime - this.startTime);
  }

  update() {
    let x = Math.round(this.x + (this.diffX * (Date.now() - this.startTime)));
    let y = Math.round(this.y + (this.diffY * (Date.now() - this.startTime)));
    this.actor.drawX = x;
    this.actor.drawY = y;
    this.map.setDirty(this.startPos);
    this.map.setDirty(this.endPos);
    if ((this.diffX !== 0) && (this.diffY !==0)) {
      let dirtyVertical =
        this.map.getLocation(this.startPos.x,
                             this.startPos.y + (this.endPos.y - this.startPos.y)).vec;
      let dirtyHorizontal =
        this.map.getLocation(this.startPos.x + (this.endPos.x - this.startPos.x),
                             this.startPos.y).vec;
      this.map.setDirty(dirtyVertical);
      this.map.setDirty(dirtyHorizontal);
    }
  }

  end(game) {
    this.map.setDirty(this.startPos);
    this.map.setDirty(this.endPos);
    if ((this.diffX !== 0) && (this.diffY !==0)) {
      let dirtyVertical =
        this.map.getLocation(this.startPos.x,
                             this.startPos.y + (this.endPos.y - this.startPos.y)).vec;
      let dirtyHorizontal =
        this.map.getLocation(this.startPos.x + (this.endPos.x - this.startPos.x),
                             this.startPos.y).vec;
      this.map.setDirty(dirtyVertical);
      this.map.setDirty(dirtyHorizontal);
    }
    this.actor.drawX = this.endPos.x * TILE_SIZE;
    this.actor.drawY = this.endPos.y * TILE_SIZE;
  }
}

class PathEvent extends Event {
  constructor(context, path) {
    super(1000);
    this.context = context;
    this.path = path;
    this.type = PATH_EVENT;
  }

  update() {
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
