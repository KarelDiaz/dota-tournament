export default class Player {
  fullName;
  nick;
  elo;
  active;
  constructor(fullName = "", nick = "", elo = 0, active = true) {
    this.fullName = fullName;
    this.nick = nick;
    this.elo = elo;
    this.active = active;
  }
}
