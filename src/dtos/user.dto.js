export const toUserDTO = (user) => ({
  id: user._id?.toString() ?? user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  role: user.role
});
