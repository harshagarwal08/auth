const services = require('../services/authServices');


const register = async(req, res) => {
    try{
        const { username , password, role } = req.body;
        const newUser = await services.register(username, password, role);
        if(role==='admin') return res.status(201).json({message:'Admin created successfully',
            username: newUser.username});
        res.status(201).json({message:'User created successfully',
            username: newUser.username});
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
};

const login = async(req, res) => {
    try{
        const { username, password } = req.body;
        const token = await services.login(username, password);
        res.status(200).json({token: token, message: 'logged in'});
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
};

const validate = async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'missing auth token', validated: false });
    }
    try {
        const decoded = await services.validate(token);
        res.json({
            user: decoded,
            validated: true
        });
    } catch (err) {
        res.status(401).json({ message: 'cannot validate', validated: false });
    }
};

module.exports = {login, register, validate};