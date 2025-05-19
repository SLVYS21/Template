const crypto = require('crypto');
const User = require('../Models/user.model');
const sendEmail = require('../utils/sendmail');

function generateRandomPassword() {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

exports.registerFirstAdmin = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        error: 'First admin already registered'
      });
    }

    const {name, email, password} = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      status: 'active'
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      err
    })
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      status: 'pending'
    });

    const admins = await User.find({ role: 'admin', status: 'active' });
    
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: 'New Admin Registration Requires Approval',
        text: `A new admin has registered and requires your approval. 
               Name: ${name}, Email: ${email}.
               Please login to the admin panel to approve or reject.`
      });
    }

    res.status(201).json({
      success: true,
      data: { email: user.email },
      message: 'Admin registration submitted. Awaiting approval from existing admins.'
    });
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: user.status === 'pending' ? 'Your account is pending approval' : 'Your account has been rejected'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      err
    })
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user with that email'
      });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
                    Please visit: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password reset token',
        text: message
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent'
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    const inviteToken = crypto
      .createHash('sha256')
      .update(req.params.invitetoken)
      .digest('hex');

    const user = await User.findOne({
      inviteToken,
      inviteTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired invitation token'
      });
    }

    user.password = req.body.password;
    user.status = 'active';
    user.inviteToken = undefined;
    user.inviteTokenExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    name: user.name,
    email: user.email,
    role: user.role
  });
};
