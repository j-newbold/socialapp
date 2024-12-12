const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173', // Change to your frontend's URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
var passport = require('passport');
require('./strategies/local-strategy.js')(passport);
const session = require('express-session');

const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const postRouter = require('./routes/posts.js');

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'jnewbold',
    saveUninitialized: false,
    resave: false,
    httpOnly: true,
    cookie: {
        maxAge: 60000 * 60
    },
}));

app.use(passport.initialize());
app.use(passport.session());

const pool = require('./db');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);


app.get('/test', (req, res) => {
    res.send(req.session);
});


app.listen(5000, () => {
    console.log('server has started on port 5000');
});