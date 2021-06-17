export default class Team {
  name;
  tournament;
  constructor(name = "", tournament = {}) {
    this.name = name;
    this.tournament = tournament;
  }
}
