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
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
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
    this.audio.loop = false;
  }
}

class Audio {
  constructor(game) {
    this.game = game;
    this.musicArray = [ new Song("01-adventures"),
                        new Song("02-eclipse"),
                        new Song("05-Firefight"),
                        new Song("06-Inanimate"),
                        new Song("07-Seven"),
                        new Song("09-Laser"),
                        new Song("11-RinseRepeat"),
                        new Song("12-Convergence"),
                        new Song("13-Remember"),
                        new Song("15-Ultraviolet"),
                        new Song("16-AllThingsEnd")
                      ];
    this.currentIndex = 0;
    this.currentSong = this.musicArray[0];
    for (let track in this.musicArray) {
      this.musicArray[track].audio.addEventListener("ended", this.playNextSong.bind(this));
    }
    
    this.slashAttackSound = new SoundEffect("melee_woosh");
    this.hitSound = new SoundEffect("hit");
    this.dodgeSound = new SoundEffect("swipe");
    this.punchSound = new SoundEffect("punch");
    this.dieSound = new SoundEffect("enemy_die");
    this.chestSound = new SoundEffect("chest");
    this.normalMagicSound = new SoundEffect("Arc");
    this.fireMagicSound = new SoundEffect("fire1");
    this.iceMagicSound = new SoundEffect("freeze");
    this.electricMagicSound = new SoundEffect("Bolt2");
    this.cureSound = new SoundEffect("cure");
  }

  playNextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.musicArray.length;
    console.log("play next song, index:", this.currentIndex);
    this.currentSong = this.musicArray[this.currentIndex];
    this.currentSong.play();
  }
  playMusic() {
    console.log("playMusic");
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
      let weapon = actor.primary;
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
  dodge() { 
    this.dodgeSound.play();
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
  cure() {
    this.cureSound.play();
  }
}

 
