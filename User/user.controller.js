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

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.getPendingAdmins = async (req, res, next) => {
  try {
    const {done} = req.query;
    const filter = {
      role: 'admin',
      status: 'pending'
    }
    if (done !== undefined) {
      filter.done = done;
    }
    const pendingAdmins = await User.find(filter);

    res.status(200).json({
      success: true,
      count: pendingAdmins.length,
      data: pendingAdmins
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.approveAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    if (admin.role !== 'admin' || admin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This user is not a pending admin'
      });
    }

    admin.status = 'active';
    admin.done = true;
    await admin.save();

    await sendEmail({
      to: admin.email,
      subject: 'Admin Registration Approved',
      text: `Your admin registration has been approved. You can now login to the system.`
    });

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.rejectAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    if (admin.role !== 'admin' || admin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This user is not a pending admin'
      });
    }

    admin.status = 'rejected';
    admin.done = true;
    await admin.save();

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const {name, email} = req.body;

    const password = generateRandomPassword();

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      status: 'active',
      createdBy: req.user.id
    });

    const inviteToken = user.getInviteToken();
    await user.save();

    const inviteUrl = `${process.env.FRONTEND_URL}/activate-account/${inviteToken}`;

    await sendEmail({
      to: email,
      subject: 'Account Invitation',
      text: `You have been invited to join the system as an employee.
            Your temporary password is: ${password}
            Please click the following link to activate your account and change your password: ${inviteUrl}`
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, status } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    
    if (req.user.role === 'admin') {
      if (role) user.role = role;
      if (status) user.status = status;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch(error) {
    return res.status(500).json({
        message: error.message,
        error
    })
  }
};
