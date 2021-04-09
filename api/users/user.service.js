//// imports
const config = require('../../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');

const User = db.users;


module.exports = {
  authenticate, 
  getAll, 
  getByEmail,
  create,
  deleteUser 
};

//// function to authenticate user ////

async function authenticate({ email, password }) {
  const user = await User.findOne({ email: email });
  if (user && bcrypt.compareSync(password, user.hash)) {

    const token = jwt.sign({ sub: user.email }, config.secret, { expiresIn: '7d' });
    return {
      token
  };

  }else{
    throw 'Username or password is incorrect';
  }
}

//// function get all users ////

async function getAll(req) {

  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await User.find()
      .select('-hash')
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await User.countDocuments();

    return {
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (err) {
    console.error(err.message);
    throw err+'';
  }
};

//// function to get user by email id ////

async function getByEmail(email) {
  return await User.findOne({email:email}).select('-hash');
};

//// function to create user ////

async function create(userDets) {
  // validate
  if (await User.findOne({ email: userDets.email })) {
    throw 'Username "' + userDets.email + '" is already taken';
  }

  const user = new User({
    email: userDets.email
  });

  // hash password
  if (userDets.password) {
    user.hash = bcrypt.hashSync(userDets.password, 10);
  }

  // save user
  await user.save()
};


//// function to delete user ////

async function deleteUser(email) {
  await User.findOneAndDelete({email:email}).then((e)=>{
    if(!e){
      throw 'Username "' + email + '" does not exist';
    }
  });
};