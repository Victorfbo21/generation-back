import express from 'express';
import { config } from 'dotenv'
import cors from 'cors'
import Routers from '../routes/index'
import { Router, Request, Response } from 'express'

const fileUpload = require("express-fileupload");


config({
    path: '.env'
})

const app = express();

app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(Routers)

app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

export default app