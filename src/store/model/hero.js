export default class Hero {
  name;
  displayName;
  picture;
  constructor(name = "", displayName = "", picture = "") {
    this.name = name;
    this.displayName = displayName;
    this.picture = picture;
  }
}
