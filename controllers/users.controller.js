const Joi = require("joi");
const userService = require("../services/users.service");
const { UserResponse } = require("../dto/userResponse");
const {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
} = require("../dto/customErrors");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  avatar: Joi.string().optional(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userService.getUserById(Number(id));
    res.status(200).json({ data: new UserResponse(user) });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = await userService.createUser(value);
    res.status(201).json({ data: new UserResponse(user) });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error); 
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = await userService.login(value);
    res.status(200).json({ data: { token } });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = { createUser, login, getUserById };
