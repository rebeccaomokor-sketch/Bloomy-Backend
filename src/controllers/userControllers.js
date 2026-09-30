
import { userModel } from "../Models/userModel.js";
import { signupValidation, loginValidation } from "../validator/userValidator.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utility/generateToken.js";

export const getHome = (req, res) => {
    res.send("Homepage!")
}

export const getAbout = (req, res) =>{
    res.send("About")
}

export const postUser = async(req, res) => {
  try {
    const {username, email, password} = req.body

   const {error} = signupValidation.validate({
    username,
    email,
    password
   })

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: `User with this ${email} already exists, please login instead`
    });
  }

  const newUser = await userModel.create({
    username,
    email,
    password  
  })

  const token = await generateToken(newUser._id)
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days convert to milliseconds
  })

  res.status(201).json({
    data: newUser,
    message: "User created successfully"
  })
  
  } catch (error) {
  console.error(error)
  throw new Error(error)
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body

    const {error} = loginValidation.validate({
      email,
      password
    })

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: `User with this ${email} does not exist, please signup instead`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials, please try again"
      });
    }

    const token = await generateToken(existingUser._id)

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days convert to milliseconds
    })

    
    res.status(200).json({
      data: existingUser,
      message: " User Login successfully",
    })


  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const getSingleuser = async (req, res) =>{
  try{
    const{id} = req.params
    const user = await userModel.findById(id)
    if (!user){
      return res.status(404).json({
        message:`User with ${id} does not exist.`
      })
    }

    return res.status(200).json({
      data: user,
      message: `User with ${id} retrieved.`
    })
  }catch (err) {
      console.error(err)
      throw new Error(err)
    }
}
