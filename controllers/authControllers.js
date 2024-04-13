import { compareAnswer, comparePassword, hashAnswer, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// status code usage 
// 201 -> for any API error message like validations(BE) or verifications(isAdmin)
// 200 => for all API success messages 
// 400/401 => for all API catch() errors

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;
    // validation - backend
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "email is Required" });
    }
    if (!password) {
      return res.send({ message: "password is Required" });
    }
    if (!phone) {
      return res.send({ message: "phone number is Required" });
    }
    if (!address) {
      return res.send({ message: "address is Required" });
    }
    if (!answer) {
      return res.send({ message: "answer is Required" });
    }
    // check user
    const existingUser = await userModel.findOne({ email }); //{email:email}
    // existing user-validation
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "Email Already registered please login",
      });
    }

    // register user
    // hash pwd
    const hashedPassword = await hashPassword(password);
    // hash(encrpting to protect user's answer ) answer 
    const hashedAnswer =await hashAnswer(answer);
    // save db
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer : hashedAnswer,
    }).save()
    // .then(function(){
    //   console.log('registered data saved successfully in DB'.bgGreen.white); 
    // })

    // sending register created msg to server-console
    console.log('Registered data saved successfully in DB'.bgGreen.white);

    // REGISTER API
    res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      user, 
    }); //{user:user}
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // login validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // decryting pwd
    // check user
    const user = await userModel.findOne({ email });
    // email/user validation
    if (!user) {
      return res.status(201).send({ //400 gives axios-error
        success: false,
        message: "Email is not registered",
      });
    }
    // decryt
    const match = await comparePassword(password, user.password);
    // pwd validation
    if (!match) {
      return res.status(201).send({
        success: false,
        message: "Incorrect password",
      });
    }

    // create token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // login API
    // send data which are needed like
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// forgotPasswordController
export const forgotPasswordController= async (req,res) =>{
  try{
    const {email,answer,newPassword} = req.body;
    // validation
    if(!email){
      return res.status(400).send({ message:"Email is required" })
    }
    if(!answer){
      return res.status(400).send({ message:"answer is required" })
    }
    if(!newPassword){
      return res.status(400).send({ message:"newPassword is required" })
    }
    // // check user
    // const user = await userModel.findOne({email,answer});
    // // user validation
    // if(!user){
    //   return res.status(200).send({
    //     success:false,
    //     message:'Wrong Email Or Answer'
    //   })
    // }

    // check user
    const user = await userModel.findOne({ email });
    // email/user validation
    if (!user) {
      return res.status(201).send({ //400 gives axios-error
        success: false,
        message: "Wrong Email",
      });
    }
    // decryt answer
    const matchAnswer = await compareAnswer(answer, user.answer);
    // pwd validation
    if (!matchAnswer) {
      return res.status(201).send({
        success: false,
        message: "Wrong Answer",
      });
    }

    // hashing New Password
    const hashedNewPassord = await hashPassword(newPassword);
    // Updating New Password in DB 
    await userModel.findByIdAndUpdate(user._id,{password: hashedNewPassord})

    // sending response
    res.status(200).send({
      success:true,
      message:" Password Reset Successfully "
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message: "Error in forgot-password-reseting",
      error
    })
  }
}

// test controllers (token)
export const testController = (req, res) => {
  res.send("Protected Route");
};
