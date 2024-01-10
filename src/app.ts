// app.ts
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import morgan from 'morgan';
import connectDB from './server/config/db'
import authRoutes from './routes/authRoutes'



dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
// view engine setup
app.use(expressEjsLayouts)
app.set('views', path.join(__dirname,"../", 'views'));
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname,'../', 'public')));
app.use('/', authRoutes);
app.use('/auth', authRoutes);

// ...
app.use(express.json());
app.use(cors());
app.use(morgan('combined'))
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


export default app;
