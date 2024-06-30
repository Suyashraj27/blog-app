const crypto = require("crypto");
// Store passwords in hashed form (not plain text) in your database to prevent unauthorized access.
const mongoose = require("mongoose");
//
const bcrypt = require("bcryptjs");
// same as crypto but salting round as improve functionalities
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({
    path:  './Config/config.env'
})
//  JWTs (JSON Web Tokens) are self-contained, signed
// packets of information used for secure authorization between a client and server. 
//They carry user data and a signature to ensure authenticity and integrity,
// enabling stateless authentication and potential SSO (Single Sign-On).

const UserSchema = new mongoose.Schema({

    username : {
        type :String,
        required : [true ,"Please provide a username"]
    },
    photo : {
        type : String,
        default : "user.png"
    },
    email : {
        type: String ,
        required : [true ,"Please provide a email"],
        unique : true ,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type:String,
        minlength: [6, "Please provide a password with min length : 6 "],
        required: [true, "Please provide a password"],
        select: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    readList : [{
        type : mongoose.Schema.ObjectId, 
        ref : "Story"
    }],
    readListLength: {
        type: Number,
        default: 0
    },
    resetPasswordToken : String ,
    resetPasswordExpire: Date 


},{timestamps: true})


UserSchema.pre("save" , async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password,salt);
    next() ;

})


UserSchema.methods.generateJwtFromUser  = function(){
    
    const  {JWT_SECRET_KEY}  = process.env.JWT_SECRET_KEY;
    const {JWT_EXPIRE} = process.env.JWT_EXPIRE;

    payload = {
        id: this._id,
        username : this.username,
        email : this.email
    }

    const token = jwt.sign(payload ,JWT_SECRET_KEY, {expiresIn :JWT_EXPIRE} );

    return token ;
}

UserSchema.methods.getResetPasswordTokenFromUser =function(){

    const { RESET_PASSWORD_EXPIRE } = process.env.RESET_PASSWORD_EXPIRE;

    const randomHexString = crypto.randomBytes(20).toString("hex");

    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    
    this.resetPasswordExpire =Date.now()+ parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
}


const User = mongoose.model("User",UserSchema);

module.exports = User  ;