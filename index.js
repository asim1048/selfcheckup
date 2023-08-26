import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'


import Connection from './database/db.js';
import Route from './routes/route.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function



const app=express();

app.use(cors());
// Get the directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',Route);

Connection();

const PORT=8000;

app.listen(PORT,()=>console.log(`Server is successfully running on port ${PORT}`))