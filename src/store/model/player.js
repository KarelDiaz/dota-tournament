export default class Player {
  fullName;
  nick;
  elo;
  active;
  constructor(
    fullName = "",
    nick = "",
    elo = 1400,
    active = true,
  ) {
    this.fullName = fullName;
    this.nick = nick;
    this.elo = elo;
    this.active = active;
  }
}
