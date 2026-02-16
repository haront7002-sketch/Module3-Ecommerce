const bcrypt = require('bcrypt');

const users = [];

const User = {
    create: async ({email, password, name, country, zip_code}) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: user + length + 1,
            email,
            password: hashedPassword,
            name: name || nulll,
            country: country || null,
            zip_code: zip_code || null,
            created_at: new Date()
        };

        user.push(newUser);
        return newUser;
    },

    findByEmail: async (email) => {
        return users.find(u => u.email === email);

    }

};

module.experts = User;



