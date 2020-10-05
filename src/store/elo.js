class Elo {
  eloA;
  eloB;

  constructor(a, b) {
    this.eloA = parseInt(a);
    this.eloB = parseInt(b);
  }

  getEloA() {
    return Math.round(this.eloA + this.getPlusA());
  }

  getEloB() {
    return Math.round(this.eloB + this.getPlusB());
  }

  puntuacionEsperadaA() {
    return 1 / (1 + Math.pow(10, (this.eloB - this.eloA) / 400));
  }

  puntuacionEsperadaB() {
    return 1 / (1 + Math.pow(10, (this.eloA - this.eloB) / 400));
  }

  getPlusA() {
    let k = this.eloA < 2100 ? 32 : this.eloA < 2100 ? 24 : 16;
    return Math.round(k * (1 - this.puntuacionEsperadaA()));
  }

  getPlusB() {
    let k = this.eloB < 2100 ? 32 : this.eloB < 2100 ? 24 : 16;
    return Math.round(k * (0 - this.puntuacionEsperadaB()));
  }
}
export default Elo;
