const mongoose = require('mongoose');
const usersModel = require('../../models/users.model');
const jwt = require('jsonwebtoken');

async function Login(username, password) {
  try {

    let user = await usersModel.findOne({ username: username });
    if (user) {
      if (user.password === password) {
        
        if (user.isActive) {
          
          const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.SECRETTKEY, { expiresIn: '30m', algorithm: 'HS256' }, );
          return { success: true, token: token, role: user.role }; 
        } else {
          
          return { success:false };
        }
      } else {
        
        return { success:false };
      }
    } else {
      
      return { success:false };
    }
  } catch (error) {
    console.error('Fail: ', error);
    return { success:false };
  }
}

module.exports = Login;
