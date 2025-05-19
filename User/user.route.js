const express = require('express');

const {
  registerFirstAdmin,
  registerAdmin,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  activateAccount
} = require('../controllers/user.auth');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin
} = require('../controllers/user.controller');

const {
    protect,
    authorize,
    isFirstUser
} = require('../Middlewares/middleware');

const router = express.Router();

router.post('/register-first-admin', isFirstUser, registerFirstAdmin);

router.post('/register', registerAdmin);

router.post('/login', login);

router.get('/logout', logout);

router.get('/me', protect, getMe);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

router.post('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

router.post('/activate/:invitetoken', activateAccount);

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/pending-admins')
  .get(getPendingAdmins);

router.route('/approve-admin/:id')
  .put(approveAdmin);

router.route('/reject-admin/:id')
  .put(rejectAdmin);

router.route('/create-employee')
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
