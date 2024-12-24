const express = require('express');
const cookieParser = require('cookie-parser');
const supabase = require('./config/supabaseClient');
const pool = require('./db');

const app = express();
const cors = require('cors');
require('dotenv').config();
const corsOptions = {
    origin: process.env.ORIGIN, // Change to your frontend's URL
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
var passport = require('passport');
require('./strategies/local-strategy.js')(passport);


const session = require('express-session');
var cookieSession = require('cookie-session');

const authRouter = require('./api/auth.js');
const usersRouter = require('./api/users.js');
const postRouter = require('./api/posts.js');

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'jnewbold',
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: process.env.NODE_ENV === 'dev'? true : true,
        sameSite: process.env.NODE_ENV === 'production'? 'none' : '',
        maxAge: 60000 * 60,
        secure: process.env.NODE_ENV === 'production'? true : false
    },
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
        tableName: 'session'
    })
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

app.get('/test', (req, res) => {
    res.send(req.user);
});


app.listen(5000, () => {
    console.log('server has started on port 5000');
});