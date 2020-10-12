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
          this.player_results.push(new PlayerResult("good"));
        } else {
          this.player_results.push(new PlayerResult("bad"));
        }
      }
    }
  }
}
export default Play;
