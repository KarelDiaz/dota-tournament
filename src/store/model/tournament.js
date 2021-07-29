export default class Tournament {
  name;
  ended;
  teams;
  type;
  constructor(name = "") {
    this.name = name;
    this.ended = false;
    this.teams = [];
    this.type = ""
  }
}
