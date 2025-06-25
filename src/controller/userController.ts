  import { Request, Response } from "express";
  import User from "../database/model/userModel";
  import jwt, { Secret } from "jsonwebtoken";

  import bcrypt from "bcrypt";
  import { envConfig } from "../config/config";
  import otpGenerator from "otp-generator";
  import sendMail from "../services/sendMail";
  import { authenticator } from "otplib";

  class UserController {
    async registerUser(req: Request, res: Response): Promise<void> {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        res.status(400).json({
          message: "Provide all the required fields",
        });
        return;
      }
      // check if user already exists\
      const existingUser = await User.findOne({
        where: {
          email: email,
        },
      });
      if (existingUser) {
        res.status(400).json({
          message: "User already exists",
        });
        return;
      }

      // create new user
      await User.create({
        username,
        password: bcrypt.hashSync(password, 10),
        email,
      });
      res.status(200).json({
        message: "User registered successfully",
      });
    }

    async loginUser(req: Request, res: Response): Promise<void> {
      const { email, password, role } = req.body;
      if (!email || !password) {
        res.status(400).json({
          message: "Provide all the required fields",
        });
        return;
      }
      // check if user exists
      const existingUser = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!existingUser) {
        res.status(400).json({
          message: "User does not exist",
        });
        return;
      }
      // check if password is correct
      const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
      if (!isPasswordValid) {
        res.status(400).json({
          message: "Invalid password",
        });
        return;
      }
      // token generation after successful login
      const token = jwt.sign(
        { userId: existingUser.id },
        envConfig.jwtSecret as Secret,
        {
          expiresIn: "30d",
        }
      );
      res.status(200).json({
        message: "User Logged in successfully",

        id: existingUser.id, 
        username: existingUser.username,
        email: existingUser.email,
        token: token,
      });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({
          message: "Provide email",
        });
        return;
      }
      // check if user exists
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(400).json({
          message: "User does not exist",
        });
        return;
      }
      // generate otp
      // const otp = otpGenerator.generate(6, {
      //   digits: true,
      //   lowerCaseAlphabets: false,
      //   upperCaseAlphabets: false,
      //   specialChars: false,
      // });
      const secret = authenticator.generateSecret();
      const otp = authenticator.generate(secret);

      // send otp to user though email
      await sendMail({
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}`,
      });
      // save otp to user
      user.otp = otp;
      user.otpExpirationTime = Date.now().toString();
      await user.save();
      res.status(200).json({
        message: "OTP sent to your email",
        otp,
      });
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
      const { email, otp, newPassword, confirmPassword } = req.body;
      if (!email || !otp || !newPassword || !confirmPassword) {
        res.status(400).json({
          message: "Provide all the required fields",
        });
        return;
      }
      // check if user exists
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(400).json({
          message: "User does not exist",
        });
        return;
      }

      // check password match
      if (newPassword !== confirmPassword) {
        res.status(400).json({
          message: "Passwords do not match",
        });
        return;
      }
      //check if otp is valid
      if (user.otp !== otp) {
        res.status(400).json({
          message: "Invalid OTP",
        });
        return;
      }
      // check if otp is expired
      const otpExpiration = (authenticator.options = {
        step: 300, // 5 minutes
      });

      // update password
      user.password = bcrypt.hashSync(newPassword, 10);

      await user.save();
      res.status(200).json({
        message: "Password reset successfully",
      });
    }
  }

  export default new UserController();
