export default class Team {
  name;
  players;
  tournament;
  constructor(name = "", tournament = {}) {
    this.name = name;
    this.players = [];
    this.tournament = tournament;
  }
}
