import store from '@/store/index';

const prop = 5000;
class Elo {

  eloA;
  eloB;

  constructor(a, b) {
    this.eloA = parseInt(a) + prop;
    this.eloB = parseInt(b) + prop;
  }

  getEloA() {
    let out = Math.round(this.eloA + this.getPlusA()) - prop;
    if (out < 0) return 0
    return out
  }

  getEloB() {
    let out = Math.round(this.eloB + this.getPlusB()) - prop;
    if (out < 0) return 0
    return out
  }

  puntuacionEsperadaA() {
    return 1 / (1 + Math.pow(10, (this.eloB - this.eloA) / 400));
  }

  puntuacionEsperadaB() {
    return 1 / (1 + Math.pow(10, (this.eloA - this.eloB) / 400));
  }

  getPlusA() {
    let k = this.eloA < 2300 + prop ? 50 : this.eloB + prop < 4600 ? 40 : 20;
    let out = Math.round(k * (1 - this.puntuacionEsperadaA()));
    if (this.eloA - prop + out < 0) return -(this.eloA - prop)
    if (out < 0) {
      if (store.getters.getRank(this.eloA - prop + out).name !== store.getters.getRank(this.eloA - prop).name) {
        return this.eloA - prop - store.getters.getRank(this.eloA - prop).min
      }
      return Math.round(out / 3);
    }
    return out
  }

  getPlusB() {
    let k = this.eloB < 2300 + prop ? 50 : this.eloB + prop < 4600 ? 40 : 20;
    let out = Math.round(k * (0 - this.puntuacionEsperadaB()));
    if (this.eloB - prop + out < 0) return -(this.eloB - prop)
    if (out < 0) {
      if (store.getters.getRank(this.eloB - prop + out).name !== store.getters.getRank(this.eloB - prop).name) {
        return this.eloB - prop - store.getters.getRank(this.eloB - prop).min
      }
      return Math.round(out / 3);
    }
    return out
  }
}
export default Elo;
