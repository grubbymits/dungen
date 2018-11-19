"use strict";

const TEXT_EVENT = 0;
const GRAPHIC_EVENT = 1;
const PATH_EVENT = 2;
const ANIMATION_EVENT = 3;

class Event {
  constructor(millisecs) {
    this.startTime = Date.now();
    this.endTime = this.startTime + millisecs;
  }

  get isFinished() {
    return (new Date().getTime() >= this.endTime);
  }

  update() { }
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
}

class HPEvent extends Event {
  constructor(context, pos, value) {
    super(1000);
    this.value = value;
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
    let x = this.x;
    let y = this.y;

    // draw plus or minus
    if (this.value > 0) {
      plusSprite.render(x, y, this.context);
    } else {
      minusSprite.render(x, y, this.context);
    }

    x += 16;
    let absVal = Math.abs(this.value);

    // draw numbers
    if (absVal > 100) {
      smallNumberSprites[Math.floor((absVal % 1000) / 100)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 10) {
      smallNumberSprites[Math.floor((absVal % 100) / 10)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 0) {
      smallNumberSprites[Math.floor(absVal % 10)].render(x, y, this.context);
      x += 16;
    }

    // draw 'HP'
    HSprite.render(x, y, this.context);
    PSprite.render(x + 16, y, this.context);
  }
}

class APEvent extends Event {
  constructor(context, pos, value) {
    super(1000);
    this.value = value;
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
    let x = this.x;
    let y = this.y;

    // draw plus or minus
    if (this.value > 0) {
      plusSprite.render(x, y, this.context);
    } else {
      minusSprite.render(x, y, this.context);
    }

    x += 16;
    let absVal = Math.abs(this.value);

    // draw numbers
    if (absVal > 100) {
      smallNumberSprites[Math.floor((absVal % 1000) / 100)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 10) {
      smallNumberSprites[Math.floor((absVal % 100) / 10)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 0) {
      smallNumberSprites[Math.floor(absVal % 10)].render(x, y, this.context);
      x += 16;
    }

    // draw 'AP'
    ASprite.render(x, y, this.context);
    PSprite.render(x + 16, y, this.context);
  }
}

class XPEvent extends Event {
  constructor(context, pos, value) {
    super(1000);
    this.value = value;
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
    let x = this.x;
    let y = this.y;

    // draw plus or minus
    plusSprite.render(x, y, this.context);
    x += 16;
    let absVal = Math.abs(this.value);

    // draw numbers
    if (absVal > 100) {
      smallNumberSprites[Math.floor((absVal % 1000) / 100)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 10) {
      smallNumberSprites[Math.floor((absVal % 100) / 10)].render(x, y, this.context);
      x += 16;
    }
    if (absVal > 0) {
      smallNumberSprites[Math.floor(absVal % 10)].render(x, y, this.context);
      x += 16;
    }

    // draw 'HP'
    XSprite.render(x, y, this.context);
    PSprite.render(x + 16, y, this.context);
  }
}

class SpriteChangeEvent extends Event {
  constructor(actor, sprite) {
    super(1000);
    this.actor = actor;
    this.sprite = sprite;
  }

  update() {
    if (this.isFinished) {
      this.actor.currentSprite = this.actor.sprite;
    } else {
      this.actor.currentSprite = this.sprite;
    }
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
    let x = 0;
    let y = 0;
    if (this.isFinished) {
      x = this.endPos.x * TILE_SIZE;
      y = this.endPos.y * TILE_SIZE;
    } else {
      x = Math.round(this.x + (this.diffX * (Date.now() - this.startTime)));
      y = Math.round(this.y + (this.diffY * (Date.now() - this.startTime)));
    }
    this.actor.drawX = x;
    this.actor.drawY = y;
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
}

class GameOverEvent {
  constructor(hero) {
    this.hero = hero;
    this.finished = false;
    this.active = false;
    console.log("creating game over event");
  }

  begin() {
    console.log("beginning game over event");
    this.active = true;
    $('#game_over_hero_icon').removeClass();
    $('#game_over_hero_icon').addClass(this.hero.className);
    $('#lvl_up_menu').css("visibility", "invisible");
    $('#game_over_menu').css("visibility", "visible");
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
