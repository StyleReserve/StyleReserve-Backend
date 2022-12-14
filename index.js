const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//passport
const passport = require('passport');
const {initialize} = require('./src/modules/passport');

//logger
const logger = require('./config/logger');

//response
const {globalResponseSet, resbuilder} = require('./src/common/resbuilder');

//routes
const test = require('./src/routes/Test/testRouter');
const auth = require('./src/routes/Auth/authRouter');
const sreserve = require('./src/routes/Sreserve/srRouter');
const op = require('./src/routes/Op/funcRouter');
const creserve = require('./src/routes/Creserve/crController');


const app = express();

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//passport initialize
app.use(passport.initialize());
initialize();


//------routes------
app.use('/test',test);
app.use('/auth',auth);
app.use('/sr',sreserve);
app.use('/op',op)
app.use('/cr',creserve);


//api not found handling
app.use(function(req, res, next) {
    logger.info(`api not found: ${req.url}`);
    next(globalResponseSet.API_NOT_FOUND);
});

//use next for setting http status;
app.use(function(error, req, res, next) {
    res.send(resbuilder(error));
});

// listen 시작
app.listen(process.env.PORT, () => {
    logger.info(`Server listening at port ${process.env.PORT}`);
});
