import PlayerResult from "./player_result";

class Play {
  player_results;
  side_win;

  constructor(player_results = [], side_win = "good") {
    this.player_results = player_results;
    this.side_win = side_win;
    if (player_results.length == 0) {
      for (let i = 0; i < 10; i++) {
        if (i < 5) {
          let good = new PlayerResult("good")
          if (side_win === 'good') good.win = true;
          this.player_results.push(good);
        } else {
          let bad = new PlayerResult("bad")
          if (side_win === 'bad') bad.win = true;
          this.player_results.push(bad);
        }
      }
    }
  }
}
export default Play;
