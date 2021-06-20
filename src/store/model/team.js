export default class Team {
  name;
  players;
  constructor(name = "") {
    this.name = name;
    this.players = [];
  }
}
