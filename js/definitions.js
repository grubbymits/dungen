"use strict";

const ENEMY_NAMES = [ "Rat",
                      "Spiders",
                      "Lizard",
                      "Spider Champion",
                      "Toad",
                      "Scarab",
                      "Centipede",
                      "Serpent",    // 7
                      "Mushroom",
                      "Rabbit",
                      "Bat",
                      "Bat Champion",
                      "Snake",
                      "Wolf",
                      "Wild Boar",
                      "Bear",        // 15
                      "Slimes",
                      "Slime Champion",
                      "Scorpion",
                      "Kraken",
                      "Vampire",
                      "Mummy",
                      "Wraith",
                      "Carabia",      // 23
                      "Goblin",
                      "Zombie",
                      "Undead",
                      "Orc",
                      "Cyclop",
                      "Werewolf",
                      "Golem",
                      "Demon" ];

const POTION_NAMES = [ "Basic Health Potion",
                       "Energy Potion",
                       "Health Potion",
                       "Defense Potion",
                       "Agility Potion",
                       "Strength Potion",
                       "Wisdom Potion",
                       "Big Health Potion"
                      ];
const SWORD_NAMES = [ "first sword",
                      "second sword",
                      "third sword",
                      "fourth sword",
                      "fifth sword",
                      "sixth sword",
                      "seventh sword",
                      "eighth sword"
                    ];
const HELMET_NAMES = [ "first helmet",
                      "second helmet",
                      "third helmet",
                      "fourth helmet",
                      "fifth helmet",
                      "sixth helmet",
                      "seventh helmet",
                      "eighth helmet"
                    ];
const ARMOUR_NAMES = [ "first armour",
                      "second armour",
                      "third armour",
                      "fourth armour",
                      "fifth armour",
                      "sixth armour",
                      "seventh armour",
                      "eighth armour"
                    ];
const SHIELD_NAMES = [ "first shield",
                      "second shield",
                      "third shield",
                      "fourth shield",
                      "fifth shield",
                      "sixth shield",
                      "seventh shield",
                      "eighth shield"
                    ];
const STAFF_NAMES = [ "first staff",
                      "second staff",
                      "third staff",
                      "fourth staff",
                      "fifth staff",
                      "sixth staff",
                      "seventh staff",
                      "eighth staff"
                    ];
const AXE_NAMES = [ "first axe",
                    "second axe",
                    "third axe",
                    "fourth axe",
                    "fifth axe",
                    "sixth axe",
                    "seventh axe",
                    "eighth axe"
                  ];

// Item types
const SWORD = 0;
const STAFF = 1;
const AXE = 2;
const SHIELD = 3;
const ARMOUR = 4;
const HELMET = 5;
const POTION = 6;
const SCROLL = 7;
const BOW = 8;

// Item subtypes
const SWORD0 = 0;
const SWORD1 = 1;
const SWORD2 = 2;
const SWORD3 = 3;
const SWORD4 = 4;
const SWORD5 = 5;
const SWORD6 = 6;
const SWORD7 = 7;

const HELMET0 = 0;
const HELMET1 = 1;
const HELMET2 = 2;
const HELMET3 = 3;
const HELMET4 = 4;
const HELMET5 = 5;
const HELMET6 = 6;
const HELMET7 = 7;

const ARMOUR0 = 0;
const ARMOUR1 = 1;
const ARMOUR2 = 2;
const ARMOUR3 = 3;
const ARMOUR4 = 4;
const ARMOUR5 = 5;
const ARMOUR6 = 6;
const ARMOUR7 = 7;

const SHIELD0 = 0;
const SHIELD1 = 1;
const SHIELD2 = 2;
const SHIELD3 = 3;
const SHIELD4 = 4;
const SHIELD5 = 5;
const SHIELD6 = 6;
const SHIELD7 = 7;

const SCROLL0 = 0;
const SCROLL1 = 1;
const SCROLL2 = 2;
const SCROLL3 = 3;
const SCROLL4 = 4;
const SCROLL5 = 5;
const SCROLL6 = 6;
const SCROLL7 = 7;

const STAFF0 = 0;
const STAFF1 = 1;
const STAFF2 = 2;
const STAFF3 = 3;
const STAFF4 = 4;
const STAFF5 = 5;
const STAFF6 = 6;
const STAFF7 = 7;

const AXE0 = 0;
const AXE1 = 1;
const AXE2 = 2;
const AXE3 = 3;
const AXE4 = 4;
const AXE5 = 5;
const AXE6 = 6;
const AXE7 = 7;

const BOW0 = 0;
const BOW1 = 1;
const BOW2 = 2;
const BOW3 = 3;
const BOW4 = 4;

// Potions
const BASIC_HEALTH_POTION = 0;
const ENERGY_POTION = 1;
const HEALTH_POTION = 2;
const DEFENSE_POTION = 3;
const AGILITY_POTION = 4;
const STRENGTH_POTION = 5;
const WISDOM_POTION = 6;
const BIG_HEALTH_POTION = 7;

const UPSCALE_FACTOR = 1;
const MAP_WIDTH_PIXELS = 2560;
const MAP_HEIGHT_PIXELS = 2560;
const TILE_SIZE = 64;
const PATH_WIDTH = 3;

const CEILING = 0;
const PATH = 1;
const WALL = 2;
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST= 3;
const MAX_DIRECTION = 4;


// Monster types
const RAT = 0;
const SPIDERS = 1;
const LIZARD = 2;
const SPIDER_CHAMPION = 3;
const TOAD = 4;
const SCARAB = 5;
const CENTIPEDE = 6;
const SERPENT = 7;
const MUSHROOM = 8;
const RABBIT = 9;
const BAT = 10;
const BAT_CHAMPION = 11;
const SNAKE = 12;
const WOLF = 13;
const WILD_BOAR = 14;
const BEAR = 15;
const SLIMES = 16;
const SLIME_CHAMPION = 17;
const SCORPION = 18;
const KRAKEN = 19;
const VAMPIRE = 20;
const MUMMY = 21;
const WRAITH = 22;
const CARABIA = 23;
const GOBLIN = 24;
const ZOMBIE = 25;
const UNDEAD = 26;
const ORC = 27;
const CYCLOP = 28;
const WEREWOLF = 29;
const GOLEM = 30;
const DEMON = 31;

// Hero types
const WARLOCK = 1;
const BERSERKER = 2;
const ROGUE = 3;
const ARCHER = 4;
const KNIGHT = 5;
const MAGE = 6;
const BLACK_MAGE = 7;

// Entity kinds
const MONSTER = 0;
const HERO = 1;
const OBJECT = 2;

// Elemental types
const NORMAL = 0;
const FIRE = 1;
const ICE = 2;
const ELECTRIC = 3;

const MAX_STRENGTH = 50;
const MAX_AGILITY = 50;
const MAX_WISDOM = 50;
const MAX_DEFENSE = 50;

const STATS = 0;
const EQUIP = 1;
const TEAM = 2;
