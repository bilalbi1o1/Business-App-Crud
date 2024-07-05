const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const logReqRes = require('./middlewares/index');
const {checkForAuthentication} = require('./middlewares/auth');

const userRouter = require('./routes/user');
const signUpRouter = require('./routes/signUp');


const app = express();
const port = 8000;

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/signUp',signUpRouter);
app.use('/api/users',checkForAuthentication,userRouter);

app.listen(port, console.log(`Server started at port ${port}`));