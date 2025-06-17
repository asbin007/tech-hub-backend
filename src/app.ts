import express from 'express';
import './database/connection'
import userRoute from './routes/userRoutes'
import categoryRoute from './routes/categoryRoute'
import productRoute from './routes/productRoute'
import reviewRoute from './routes/reviewRoute'
import cartRoute from './routes/cartRoute'
import orderRoute from './routes/orderRoute'
import cors from 'cors'

const app=express()
app.use(express.json())

app.use(cors({
    origin: '*',
    
}))


app.use('/api/auth',userRoute)
app.use('/api/category',categoryRoute)
app.use('/api/product',productRoute)
app.use('/api/review',reviewRoute)
app.use('/api/cart',cartRoute)
app.use('/api/order',orderRoute)
app.use(express.static('./src/uploads'));







export default app;