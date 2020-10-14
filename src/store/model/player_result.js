export default class PlayerResult {
  kills;
  deths;
  asist;
  side;
  level;
  win;
  bot;
  hero;
  player;
  elo;
  eloPlus;
  constructor(
    side = "",
    kills = 0,
    deths = 0,
    asist = 0,
    level = 1,
    win = false,
    bot = true,
    hero = "5f763c758e17a0310415d51b",
    player = "5f83b3518ea4f42ae861a9d3",
    elo = 0,
    eloPus = 0
  ) {
    this.kills = kills;
    this.deths = deths;
    this.asist = asist;
    this.side = side;
    this.level = level;
    this.win = win;
    this.bot = bot;
    this.hero = hero;
    this.player = player;
    this.elo = elo;
    this.eloPlus = eloPus;
  }
}
