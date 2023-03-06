const controllers = require('../controllers/authControllers');

const express = require('express');

const router = express.Router();

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.get('/validate', controllers.validate);

module.exports = router;
