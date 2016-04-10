class AudioResource {
  constructor(name) {
    this.audio = document.createElement("AUDIO");
  }
  play() {
    this.audio.play();
  }
  pause() {
    this.audio.pause();
  }
}
class SoundEffect extends AudioResource {
  constructor(name) {
    super(name);
    this.audio.src = "res/audio/" + name + ".ogg";
  }
}
class Song extends AudioResource {
  constructor(name) {
    super(name);
    this.audio.src = "res/audio/music/" + name + ".ogg";
  }
}

class Audio {
  constructor(game) {
    this.game = game;
    this.musicArray = [ new Song("01-adventures"),
                        new Song("02-eclipse")
                      ];
    for (let track of this.musicArray) {
      track.audio.addEventListener("ended", this.playNextSong.bind(this));
    }
    this.currentSong = this.musicArray[0];
    this.currentIndex = 0;
    this.currentSong.audio.autoplay = true;
    
    this.slashAttackSound = new SoundEffect("melee_woosh");
    this.hitSound = new SoundEffect("hit");
    this.punchSound = new SoundEffect("punch");
    this.dieSound = new SoundEffect("enemy_die");
    this.chestSound = new SoundEffect("chest");
    this.normalMagicSound = new SoundEffect("Arc");
    this.fireMagicSound = new SoundEffect("fire1");
    this.iceMagicSound = new SoundEffect("freeze");
    this.electricMagicSound = new SoundEffect("Bolt2");
  }
  playNextSong() {
    console.log("play next song");
    this.currentIndex = (this.currentIndex) + 1 % this.musicArray.length;
    this.currentSong = this.musicArray[this.currentIndex];
    this.currentSong.audio.currentTime = 0;
    this.currentSong.play();
  }
  playMusic() {
    if (!this.currentSong.playing) {
      this.currentSong.play();
    }
  }
  pauseMusic() {
    if (!this.currentSong.paused) {
      this.currentSong.pause();
    }
  }
  playAttack(actor) {
    if (actor.kind == HERO) {
      let weapon = actor.weapon;
      switch(weapon.type) {
        case AXE:
        case SWORD:
          this.slash();
          break;
        case STAFF:
          if (weapon.elemType == FIRE) {
            this.fireMagic();
          } else if (weapon.elemType == ICE) {
            this.iceMagic();
          } else if (weapon.elemtType == ELECTRIC) {
            this.electricMagic();
          } else {
            this.normalMagic();
          }
          break;
      }
    } else {
      this.punch();
    }
  }
  
  slash() {
    this.slashAttackSound.play();
  }
  hit() {
    this.hitSound.play();
  }
  punch() {
    this.punchSound.play();
  }
  die() {
    this.dieSound.play();
  }
  chest() {
    this.chestSound.play();
  }
  normalMagic() {
    this.normalMagicSound.play();
  }
  fireMagic() {
    this.fireMagicSound.play();
  }
  iceMagic() {
    this.iceMagicSound.play();
  }
  electricMagic() {
    this.electricMagicSound.play();
  }
}

 
