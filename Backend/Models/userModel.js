const bcrypt = require('bcrypt');

const users = [];

const User = {

    create: async ({ email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        return newUser;
    },

    findByEmail: async (email) => {
        return users.find(u => u.email === email);
    }
};

module.exports = User;
