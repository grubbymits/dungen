class GraphicsEngine {
  notify(actor, target, result) {
    switch(result.type) {
    case ATTACK:
      break;
    case DAMAGE:
      this.events.push(new SpriteChangeEvent(target, target.damageSprite));
      this.events.push(new HPEvent(target.pos, result.value));
      break;
    case HP:
      this.events.push(new SpriteChangeEvent(target, target.healSprite));
      this.events.push(new HPEvent(target.pos, result.value));
      break;
    case AP:
      this.events.push(new APEvent(target.pos, result.value));
      break;
    case BURN:
      this.events.push(new SpriteChangeEvent(target, target.burntSprite));
      this.events.push(new HPEvent(target.pos, result.value));
      break;
    case POISON:
      this.events.push(new SpriteChangeEvent(target, target.poisonedSprite));
      this.events.push(new HPEvent(target.pos, result.value));
      break;
    case FREEZE:
      this.events.push(new SpriteChangeEvent(target, target.frozenSprite));
      this.events.push(new APEvent(target.pos, result.value));
      break;
    case SHOCK:
      this.events.push(new SpriteChangeEvent(target, target.shockedSprite));
      this.events.push(new APEvent(target.pos, result.value));
      this.events.push(new HPEvent(target.pos, result.value));
      break;
    }
  }

  render() {
    for (let i in this.events) {
      let event = this.events[i];
      let finished = event.update();
      if (finished) {
        delete this.events[i];
        this.events.splice(i, 1);
      }
    }
  }
}
