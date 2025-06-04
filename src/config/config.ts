import { config } from "dotenv"

config()
export const envConfig={
    port: process.env.PORT || 2001,
    dbUrl:process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration:process.env.JWT_EXPIRATION ,
    email: process.env.EMAIL,
    password: process.env.EMAIL_PASSWORD,

}