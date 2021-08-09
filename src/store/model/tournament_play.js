export default class TournamentPlay {
  tournament;
  play;
  teamGoodood;
  teamBadad;
  constructor(tournament = {}, play = {}, teamGood = {}, teamBad = {}) {
    this.tournament = tournament
    this.play = play
    this.teamGood = teamGood
    this.teamBad = teamBad
  }
}
