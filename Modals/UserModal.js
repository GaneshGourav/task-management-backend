const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
{
    versionKey:false
});

const UserModal = mongoose.model("user", userSchema);

module.exports = {
  UserModal,
};
