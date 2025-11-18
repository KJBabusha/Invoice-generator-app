const jwt = require ("jsonwebtoken");
const User = require("../models/User");

//Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Register new user
// @route Post /api/auth/register 
// @access Public  
exports.registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        if (!name || !email || !password){
            return res.status(400).json ({message: "Please fill all fields"});
        }

        //Check if User Exist
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json ({message:"User already Exist"});
        }

        //Create user
        const user = await User.create({name, email, password});
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }else{
            res.status(400).json({message: "Invalid User Data"});
        }
        
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

//@desc Login User
//@route POST /api/auth/login
//@access Public
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email}).select("+password");

        if(user&& (await user.matchPassword(password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken (user._id),

                businessName: user.businessName || '',
                businessAddress: user.businessAddress || '',
                phoneNumber: user.phoneNumber || '',
            });
        }else{
            res.status(401).json({message: "Invalid cridentials"
            });
        }
        
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

//@desc Get current logged-in user
//@route GET /api/auth/me
//@access Private
exports.getMe = async (req,res) =>{

    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            businessName: user.businessName || '',
            businessAddress: user.businessAddress || '',
            phoneNumber: user.phoneNumber || '',
        });
        
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

//@desc Update user profile
//@route PUT /api/auth/me
//@access Private
exports.updateUserProfile = async (req, res) => {

    try { 
        const user = await User.findById(req.user.id);

        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.businessName = req.body.businessName || user.businessName;
            user.businessAddress = req.body.businessAddress || user.businessAddress;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                businessName: updatedUser.businessName || '',
                businessAddress: updatedUser.businessAddress || '',
                phoneNumber: updatedUser.phoneNumber || '',
            });
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};
