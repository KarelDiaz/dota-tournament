export default class Tournament {
  name;
  ended;
  teams;
  constructor(name = "") {
    this.name = name;
    this.ended = false;
    this.teams = [];
  }
}
