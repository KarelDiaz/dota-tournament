export default class Player {
  fullName;
  nick;
  mmr;
  active;
  constructor(fullName = "", nick = "", mmr = 0, active = true) {
    this.fullName = fullName;
    this.nick = nick;
    this.mmr = mmr;
    this.active = active;
  }
}
