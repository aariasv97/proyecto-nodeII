import UserRepository from "../repositories/users.repository.js";

export const getAllUsersService = () => {
return UserRepository.findAll();
};