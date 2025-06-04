import nodemailer from "nodemailer";
import { envConfig } from "../config/config";

interface IData {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (data: IData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envConfig.email,
        pass: envConfig.password,
      },
    });
    const mailOption = {
      form: envConfig.email,
      to: data.to,
      subject: data.subject,
      text: data.text,
    };
    await transporter.sendMail(mailOption);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
export default sendMail;