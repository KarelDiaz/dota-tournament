import {
  HERALD,
  GUARDIAN,
  CRUSADER,
  ARCHON,
  LEGEND,
  ANCIENT,
  DIVINE,
  // INMORTAL
} from '@/store/rank-type.js';

export default class Player {
  fullName;
  nick;
  elo;
  active;
  constructor(fullName = "", nick = "", elo = 0, active = true) {
    this.fullName = fullName;
    this.nick = nick;
    this.elo = elo;
    this.active = active;
  }

  static getRank(elo) {
    if (elo < 700) return HERALD
    if (elo < 1540) return GUARDIAN
    if (elo < 2380) return CRUSADER
    if (elo < 3220) return ARCHON
    if (elo < 4060) return LEGEND
    if (elo < 4900) return ANCIENT
    return DIVINE
  }
}
