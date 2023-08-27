const express = require('express');

const authControllers = require('./../controllers/authControllers');
const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

// Protect all routes after this middleware 
router.use(authControllers.protect)

router.patch(
  '/updateMyPassword',
  authControllers.updatePassword
);

module.exports = router;
