const express = require('express');
const cors = require('cors');
const logReqRes = require('./middlewares/index');
const userRouter = require('./routes/user');

const app = express();
const port = 8000;

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));
app.use(express.json());

//Routes
app.use('/api/users',userRouter);

app.listen(port, console.log(`Server started at port ${port}`));