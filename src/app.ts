import express from 'express';
import './database/connection'
import userRoute from './routes/userRoutes'
import cors from 'cors'

const app=express()
app.use(express.json())

app.use(cors({
    origin: '*',
    
}))


app.use('/api/auth',userRoute)





export default app;