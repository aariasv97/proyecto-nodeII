import User from "../models/User.js";

class UserDAO {
  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(userId) {
    return User.findById(userId);
  }

  findAll() {
    return User.find();
  }

  create(userData) {
    return User.create(userData);
  }
}

export default new UserDAO();
