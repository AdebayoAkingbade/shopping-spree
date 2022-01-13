const router = require("express").Router();
const User = require("../models/Users")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_PASS
          ).toString(),
        // password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString
    })
    try{
    const savedUser= await newUser.save();
    res.status(201).json(savedUser)
    } catch(err){
        res.status(500).json(err)
    }
})

router.post('/login', async(req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        console.log(user)

        !user && res.status(401).json("Invalid username");

        const hashPwd = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_PASS
        );

        const mainPassword = hashPwd.toString(CryptoJS.enc.Utf8);
        // const hash = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
        const logPassword = req.body.password;

        mainPassword != logPassword && 
            res.status(401).json("Wrong Password");
        
        const token = jwt.sign(
            {
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_JWT,
            {expiresIn: "2d"}
        );

        const {password, ...others} = user._doc;
        return res.status(200).json({...others, token});
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router