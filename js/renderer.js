"use strict";

class Renderer {
  constructor(background, foreground, overlayContext, map, actors, objects) {
    this.background = background;
    this.foreground = foreground;
    this.overlayContext = overlayContext;
    this.map = map;
    this.actors = actors;
    this.objects = objects;
    this.events = [];
  }

  renderMap(symbolLocs) {
    // draw everything
    this.background.fillStyle = '#000000';
    this.background.fillRect(0, 0,
                          this.map.width * TILE_SIZE * UPSCALE_FACTOR,
                          this.map.height * TILE_SIZE * UPSCALE_FACTOR);
    for (var x = 0; x < this.map.width; x++) {
      for (var y = 0; y < this.map.height; y++) {
        let type = this.map.getLocationType(x,y);
        if (type != CEILING) {
          let spriteIdx = this.map.getLocationSprite(x, y);
          tileSprites[spriteIdx].render(x * TILE_SIZE, y * TILE_SIZE,
                                        this.background);
        }
      }
    }
    for (let loc of symbolLocs) {
      let spriteIdx = 0;
      if (Math.random() < 0.16) {
        spriteIdx = 0;
      } else if (Math.random() < 0.33) {
        spriteIdx = 1;
      } else if (Math.random() < 0.5) {
        spriteIdx = 2;
      } else if (Math.random() < 0.66) {
        spriteIdx = 3;
      } else if (Math.random() < 0.73) {
        spriteIdx = 4;
      } else if (Math.random() < 0.73) {
        spriteIdx = 5;
      }
      let sprite = symbolSprites[spriteIdx];
      sprite.render(loc.vec.x * TILE_SIZE, loc.vec.y * TILE_SIZE,
                    this.background);
    }
  }

  clearOverlay() {
    this.overlayContext.fillStyle = '#000000';
    this.overlayContext.fillRect(0, 0,
                                 this.map.width * TILE_SIZE,
                                 this.map.height * TILE_SIZE);
  }

  renderChanges() {
    for (let vec of this.map.newVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
    }
    this.map.newVisible.clear();

    this.overlayContext.globalAlpha = 0.5;
    this.overlayContext.fillStyle = '#000000';
    for (let vec of this.map.newPartialVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
      this.overlayContext.fillRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                   TILE_SIZE, TILE_SIZE);
    }
    this.map.newPartialVisible.clear();
    this.overlayContext.globalAlpha = 1.0;
  }
 
  renderEntities(currentHero) {
    this.foreground.clearRect(0, 0, this.map.width * TILE_SIZE,
                              this.map.height * TILE_SIZE);
    for (let actor of this.actors) {
      let loc = this.map.getLocation(actor.pos.x, actor.pos.y);

      if (actor.kind == HERO) {
        if (actor == currentHero) {
          currentActorIdentifier.render(actor.drawX, actor.drawY,
                                        this.foreground);
        }
      }
      this.foreground.fillStyle = 'orangered';
      let healthBar = (actor.currentHealth / actor.maxHealth) * TILE_SIZE;
      this.foreground.fillRect(actor.drawX, actor.drawY, healthBar, 2);
      this.foreground.fillStyle = 'cadetblue';
      let energyBar = (actor.currentEnergy / actor.maxEnergy) * TILE_SIZE;
      this.foreground.fillRect(actor.drawX, actor.drawY + 3, energyBar, 2);
      actor.currentSprite.render(actor.drawX, actor.drawY,
                                 this.foreground);
    }
    for (let object of this.objects) {
      let loc = this.map.getLocation(object.pos.x, object.pos.y);
      object.sprite.render(object.drawX, object.drawY,
                             this.foreground);
    }
  }

  renderUI(level, openChests, totalChests, monstersKilled, totalMonsters,
            wallet) {
    let canvas = document.getElementById("scoreCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    levelUISprites[0].render(0, 0, context);
    levelUISprites[level].render(32, 0, context);

    killsSprite.render(0, 32, context);
    let remaining = totalMonsters - monstersKilled;
    largeNumberSprites[Math.floor(remaining / 10)].render(32, 32, context);
    largeNumberSprites[remaining % 10].render(48, 32, context);

    chestIconSprite.render(0, 64, context);
    remaining = totalChests - openChests;
    largeNumberSprites[Math.floor(remaining / 10)].render(32, 64, context);
    largeNumberSprites[remaining % 10].render(48, 64, context);

    coinIconSprite.render(0, 96, context);
    largeNumberSprites[Math.floor(wallet / 1000)].render(32, 96, context);
    largeNumberSprites[Math.floor((wallet % 1000) / 100)].render(48, 96, context);
    largeNumberSprites[Math.floor((wallet % 100) / 10)].render(64, 96, context);
    largeNumberSprites[Math.floor(wallet % 10)].render(80, 96, context);
  }

  renderEvents() {
    for (let i in this.events) {
      let event = this.events[i];
      event.update();
      if (event.isFinished) {
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
  }

  notify(change) {
    if (change.type == NOTHING) {
      return;
    }

    let actor = change.actor;
    let pos = new Vec(actor.pos.x, actor.pos.y - 1);
    switch(change.type) {
    case HP_EVENT:
      this.events.push(new SpriteChangeEvent(actor, actor.healSprite));
      this.events.push(new HPEvent(this.foreground, actor.pos, change.amount));
      break;
    case AP_EVENT:
    case REST_EVENT:
      this.events.push(new APEvent(this.foreground, actor.pos, change.amount));
      break;
    case XP_EVENT:
      break;
    case TARGET_EVENT:
      this.events.push(new GraphicEvent(this.foreground, actor.pos, targetSprite));
      break;
    case PRIMARY_ATTACK_EVENT:
      if (actor.kind == HERO) {
        this.events.push(new GraphicEvent(this.foreground, pos, actor.primary.sprite));
      }
      break;
    case SECONDARY_ATTACK_EVENT:
      if (actor.kind == HERO) {
        this.events.push(new GraphicEvent(this.foreground, pos, actor.secondary.sprite));
      }
      break;
    case DODGE_EVENT:
      break;
    case PHYSICAL_EVENT: {
      let target = change.target;
      this.events.push(new SpriteChangeEvent(target, target.damageSprite));
      this.events.push(new HPEvent(this.foreground, target.pos, change.amount));
      break;
    }
    case POTION_EVENT:
      this.events.push(new GraphicEvent(this.foreground, pos, change.target.sprite));
      break;
    case SPELL_EVENT:
      this.events.push(new GraphicEvent(this.foreground, pos, change.target.sprite));
      break;
    case FIRE_EVENT: {
      let target = change.target;
      this.events.push(new SpriteChangeEvent(target, target.burntSprite));
      this.events.push(new HPEvent(this.foreground, target.pos, change.amount));
      break;
    }
    case POISON_EVENT: {
      let target = change.target;
      this.events.push(new SpriteChangeEvent(target, target.poisonedSprite));
      this.events.push(new HPEvent(this.foreground, target.pos, change.amount));
      break;
    }
    case ICE_EVENT: {
      let target = change.target;
      this.events.push(new SpriteChangeEvent(target, target.frozenSprite));
      this.events.push(new APEvent(this.foreground, target.pos, change.amount));
      break;
    }
    case ELECTRIC_EVENT: {
      let target = change.target;
      this.events.push(new SpriteChangeEvent(target, target.shockedSprite));
      this.events.push(new APEvent(this.foreground, target.pos, change.amount));
      this.events.push(new HPEvent(this.foreground, target.pos, change.amount));
      break;
    }
    }
  }
}
