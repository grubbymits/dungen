this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/dungen/',
        '/dungen/menu.html',
        '/dungen/guide.html',
        '/dungen/new_game.html',
        '/dungen/start.html',
        '/dungen/css/codingbear.css',
        '/dungen/css/dungen.css',
        '/dungen/css/font-awesome.css',
        '/dungen/css/materialize.css',
        '/dungen/js/actions.js',
        '/dungen/js/actor.js',
        '/dungen/js/audio.js',
        '/dungen/js/definitions.js',
        '/dungen/js/dungen.js',
        '/dungen/js/effects.js',
        '/dungen/js/entity.js',
        '/dungen/js/game.js',
        '/dungen/js/hero.js',
        '/dungen/js/item.js',
        '/dungen/js/map.js',
        '/dungen/js/materialize.js',
        '/dungen/js/monsters.js',
        '/dungen/js/sprite.js',
        '/dungen/js/ui.js',
        '/dungen/js/util.js',
        '/dungen/res/audio/chest.ogg',
        '/dungen/res/audio/cure.ogg',
        '/dungen/res/audio/door.ogg',
        '/dungen/res/audio/enemy_die.ogg',
        '/dungen/res/audio/fire1.ogg',
        '/dungen/res/audio/freeze.ogg',
        '/dungen/res/audio/hit.ogg',
        '/dungen/res/audio/melee_woosh.ogg',
        '/dungen/res/audio/punch.ogg',
        '/dungen/res/audio/swipe.ogg',
        '/dungen/res/audio/music/01-adventure.ogg',
        '/dungen/res/audio/music/02-eclipse.ogg',
        '/dungen/res/audio/music/05-Firefight.ogg',
        '/dungen/res/audio/music/06-Inanimate.ogg',
        '/dungen/res/audio/music/07-Seven.ogg',
        '/dungen/res/audio/music/09-Laser.ogg',
        '/dungen/res/audio/music/11-RinseRepeat.ogg',
        '/dungen/res/audio/music/12-Convergence.ogg',
        '/dungen/res/audio/music/13-Remember.ogg',
        '/dungen/res/audio/music/15-Ultraviolet.ogg',
        '/dungen/res/audio/music/16-AllThingsEnd.ogg',
        '/dungen/res/img/archer.png',
        '/dungen/res/img/favico.ico',
        '/dungen/res/img/icon.png',
        '/dungen/res/img/knight.png',
        '/dungen/res/img/mage.png',
        '/dungen/res/img/main-button.png',
        '/dungen/res/img/menu.png',
        '/dungen/res/img/rogue.png',
        '/dungen/res/img/tileset-blue-64.png',
        '/dungen/res/img/tileset-green-64.png',
        '/dungen/res/img/tileset-purple-64.png',
        '/dungen/res/img/tileset-red-64.png',
        '/dungen/res/img/tileset-yellow-64.png',
        '/dungen/res/img/ui.png',
        '/dungen/res/img/warlock.png'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    });
  );
});