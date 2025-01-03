class UserAlreadyExistsError extends Error {
  constructor(message = "User already exists") {
    super(message);
    this.name = "UserAlreadyExistsError";
    this.status = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message = "Your Password or Email is wrong") {
    super(message);
    this.name = "AuthenticationError";
    this.status = 401;
  }
}

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message = "Request invalid") {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

class DatabaseError extends Error {
  constructor(message = "server has a problem") {
    super(message);
    this.name = "DatabaseError";
    this.status = 500;
  }
}

module.exports = {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  DatabaseError,
};
