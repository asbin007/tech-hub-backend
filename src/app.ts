import express from 'express';
import './database/connection'
import userRoute from './routes/userRoutes'
import categoryRoute from './routes/categoryRoute'
import cors from 'cors'

const app=express()
app.use(express.json())

app.use(cors({
    origin: '*',
    
}))


app.use('/api/auth',userRoute)
app.use('/api/category',categoryRoute)





export default app;