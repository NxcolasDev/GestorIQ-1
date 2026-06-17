const bcrypt = require('bcrypt');

User.beforeCreate(async (user) => {
  user.senha = await bcrypt.hash(user.senha, 10);
});