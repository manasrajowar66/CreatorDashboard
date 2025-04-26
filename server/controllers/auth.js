const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (data)=>{
   return jwt.sign(data, JWT_SECRET);
}

const decodeToken = (token)=>{
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateToken,
    decodeToken
}