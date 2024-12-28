class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.point = user.point;
  }
}

module.exports = { UserResponse };