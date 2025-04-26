const { randomBytes, createHmac } = require("crypto");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    credits: { type: Number, default: 0 },
    lastLogin: Date,
    profileCompleted: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    address: { type: String }
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();

  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.password = hashPassword;
  this.salt = salt;

  next();
});

module.exports = mongoose.model("User", userSchema);;
