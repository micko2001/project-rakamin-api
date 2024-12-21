class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.point = user.point;
  }
}

module.exports = { UserResponse };
