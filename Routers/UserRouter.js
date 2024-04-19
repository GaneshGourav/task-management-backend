const express = require("express");
const { UserModal } = require("../Modals/UserModal");
require('dotenv').config()
const saltRounds = parseInt(process.env.saltrounds) || 10;
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../Modals/Blacklist");
const { auth } = require("../Middleware/auth");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {


   
  const {name, username, email, password } = req.body;
console.log(req.body)
  try {
    let user = await UserModal.findOne({ email });

    if (!user) {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          return res
            .status(400)
            .json({ msg: "Something went wrong, Try again...." });
        } else {
          let user = new UserModal({name, username, email, password: hash });
          await user.save();
          return res.status(200).json({ msg: "Account Created Successfully" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ msg: "You are already registered, try to login.." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error, Try Again..." });
  }


});






userRouter.post("/login",async (req, res) => {
    try{
        const {email,password} = req.body

        if(!email || !password){
            res.status(200).send({message:"All Input fields are required!"})
         }else{
            const user = await UserModal.findOne({email})
            if(!user){
                res.status(202).send({message:"User Does Not Exist!"})
            }else{
                const passwordMatch = await bcrypt.compare(password, user.password);
    
                if (passwordMatch) {
                    const token = jwt.sign({userId:user._id}, process.env.SecretKey,{ expiresIn: 24*7*60 });
                    res.status(200).send({ message: "Login successful!", token , user });
                } else {
                    res.status(200).send({ message: "Incorrect password!" });
                }
            }
         }
    
      }
      catch(err){
        console.log(err)
        res.status(500).send({ message: "Internal Server Error", error: err.message  });
    } 
})

userRouter.patch('/update/:userID',auth, async (req, res) => {
    try {
      const userID = req.params.userID;
      const { name, username, email, password } = req.body;
  
      const updateFields = {};
      if (name) updateFields.name = name;
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (password) {
        updateFields.password = await bcrypt.hash(password, saltRounds);
      }
  
      const user = await UserModal.findOneAndUpdate(
        { _id: userID },
        updateFields,
        { new: true }
      );
  
      if (!user) {
        res.status(404).send({ message: "User Not found!" });
      } else {
        res.status(200).send({ message: "User updated successfully!", user });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
  });
  


userRouter.post("/logout", async (req, res) => {
  const token = req.headers.authorization;
  
  try {
      if (token) {
          // Use findOneAndUpdate to ensure only one document is updated
          await BlacklistModel.findOneAndUpdate({}, { $addToSet: { blacklist: token } }, { upsert: true });
          res.status(200).json({ msg: "User has been logged out" });
      } else {
          res.status(400).json({ error: "Token is not coming" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
