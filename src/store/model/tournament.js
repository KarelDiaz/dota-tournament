export default class Tournament {
  name;
  ended;
  teams;
  type;
  plays;
  constructor(name = "") {
    this.name = name;
    this.ended = false;
    this.teams = [];
    this.type = "";
    this.plays = [];
  }
}
