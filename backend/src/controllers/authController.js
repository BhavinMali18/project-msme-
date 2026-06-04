const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {

    const {
      companyName,
      contactPerson,
      email,
      phone,
      password
    } = req.body;

    const hash =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        companyName,
        contactPerson,
        email,
        phone,
        password: hash
      });

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user =
    await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "User not found"
    });

  const match =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!match)
    return res.status(400).json({
      message: "Invalid Password"
    });

  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    user
  });
};