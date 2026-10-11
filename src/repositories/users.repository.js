import UserDAO from "../dao/users.dao.js";

class UserRepository {
  findByEmail(email) {
    return UserDAO.findByEmail(email);
  }

  findById(userId) {
    return UserDAO.findById(userId);
  }

  findAll() {
    return UserDAO.findAll();
  }

  create(userData) {
    return UserDAO.create(userData);
  }
}

export default new UserRepository();
