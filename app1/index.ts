import express from 'express';

const app = express()

app.use(express.json())
app.use('/r', require('./routes/reports.routes'))
app.use('/s', require('./routes/search.routes'))
app.use('/', require('./routes/kafka.routes'))

app.listen(process.env.PORT)