const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../database/models');

const register = async(username, password, role) => {
    const user = await User.findOne({ where: { username } });
    if (user) {
        throw new Error('Username already exists');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    return await User.create({
        username,
        password: encryptedPassword,
        role
    });
};

const login = async(username, password) => {
    const user = await User.findOne(
        { where: { username } },
    );    
    if (!user) {
        throw new Error('User does not exist');
    }
    if(await bcrypt.compare(password, user.password))
    {
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.KEY);
        return token;
    }
    throw new Error('Invalid password');
};

const validate = async(token) => {
    const decoded = jwt.verify(token, process.env.KEY);
    return decoded;
};

module.exports = {login, register, validate};