const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisUtil = require('../utils/redisUtil');
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
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET_KEY);
        redisUtil.set(token);
        return token;
    }
    throw new Error('Invalid password');
};

const validate = async(token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const redisToken = await redisUtil.get();
    if(redisToken!==token) throw new Error('not validated');
    return decoded;
};

module.exports = {login, register, validate};