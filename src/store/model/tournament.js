export default class Tournament {
  name;
  ended;
  teams;
  type;
  constructor(name = null) {
    this.name = name;
    this.ended = false;
    this.teams = [];
    this.type = null;
    this.plays = [];
  }
}
