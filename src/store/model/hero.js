export default class Hero {
  name;
  displayName;
  picture;
  video;
  constructor(name = "", displayName = "", picture = "", video = "") {
    this.name = name;
    this.displayName = displayName;
    this.picture = picture;
    this.video = video;
  }
}
