import { config } from "dotenv"

config()
export const envConfig={
    port: process.env.PORT || 2001,
    dbUrl:process.env.DATABASE_URL
}