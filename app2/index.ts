import express from 'express';
import {connect} from 'mongoose';
import { usrConsumer} from './consumers/user.consumer';
import { movConsumer } from './consumers/movie.consumer';
import { revConsumer } from './consumers/review.consumer';
const app = express()
connect(process.env.MONGO_URL!)

app.use(express.json())
app.use('/r', require('./routes/reports.routes'))
app.use('/s', require('./routes/search.routes'))

//consumers init
const usrCons = usrConsumer
const movCons = movConsumer
const revCons = revConsumer

app.listen(process.env.PORT)