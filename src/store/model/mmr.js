import store from '@/store/index';

const prop = 5000;
const lostProp = 1 / 3;

class MMR {

  mmrA;
  mmrB;

  constructor(a, b) {
    this.mmrA = parseInt(a) + prop;
    this.mmrB = parseInt(b) + prop;
  }

  getMMRA() {
    let out = Math.round(this.mmrA + this.getPlusA()) - prop;
    if (out < 0) return 0
    return out
  }

  getMMRB() {
    let out = Math.round(this.mmrB + this.getPlusB()) - prop;
    if (out < 0) return 0
    return out
  }

  puntuacionEsperadaA() {
    return 1 / (1 + Math.pow(10, (this.mmrB - this.mmrA) / 400));
  }

  puntuacionEsperadaB() {
    return 1 / (1 + Math.pow(10, (this.mmrA - this.mmrB) / 400));
  }

  getPlusA() {
    let k = this.mmrA < 2300 + prop ? 50 : this.mmrB + prop < 4600 ? 40 : 20;
    let out = Math.round(k * (1 - this.puntuacionEsperadaA()));
    if (out < 0) {
      out = Math.round(out * lostProp)
      if (this.mmrA - prop + out < 0) return -(this.mmrA - prop)
      if (store.getters.getRank(this.mmrA - prop + out).name !== store.getters.getRank(this.mmrA - prop).name) {
        return -(this.mmrA - prop - store.getters.getRank(this.mmrA - prop).min)
      }
      return out;
    }
    return out
  }

  getPlusB() {
    let k = this.mmrB < 2300 + prop ? 50 : this.mmrB + prop < 4600 ? 40 : 20;
    let out = Math.round(k * (0 - this.puntuacionEsperadaB()));
    if (out < 0) {
      out = Math.round(out * lostProp)
      if (this.mmrB - prop + out < 0) return -(this.mmrB - prop)
      if (store.getters.getRank(this.mmrB - prop + out).name !== store.getters.getRank(this.mmrB - prop).name) {
        return -(this.mmrB - prop - store.getters.getRank(this.mmrB - prop).min)
      }
      return out;
    }
    return out
  }
}
export default MMR;
