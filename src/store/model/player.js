export default class Player {
  fullName;
  nick;
  elo;
  active;
  num_plays;
  num_plays_win;
  constructor(
    fullName = "",
    nick = "",
    elo = 1400,
    active = true,
    num_plays = 0,
    num_plays_win = 0
  ) {
    this.fullName = fullName;
    this.nick = nick;
    this.elo = elo;
    this.active = active;
    this.num_plays = num_plays;
    this.num_plays_win = num_plays_win;
  }
}
