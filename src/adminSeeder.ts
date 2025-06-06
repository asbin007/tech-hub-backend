import  bcrypt  from 'bcrypt';
import { envConfig } from './config/config';
import User from './database/model/userModel';


const adminSeeder=async()=>{

const data= await User.findOne({
    where:{
        email:envConfig.admin_email
    }
})

if(!data){
    await User.create({
        username:envConfig.admin_username,
        email:envConfig.admin_email,
        password: bcrypt.hashSync(envConfig.admin_password as string, 10),
        role:"admin"

    })
    console.log("Admin seeded successfully")

}
else{
    console.log("Admin already seeded")
}

}
export default adminSeeder