var passport = require('passport');
var Strategy = require('passport-local');
const pool = require('../db.js');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
    try {
        const searchRes = await pool.query('select * from users where userid = $1', [id]);
        if (searchRes.rowCount == 0) throw new Error('user not found');
        done(null, searchRes.rows[0]);
    } catch (error) {
        done(error, null);
    }
})

module.exports = (passport) => {
    passport.use(
        new Strategy(async (username, password, done) => {
            try {
                const searchRes = await pool.query('select * from users where username = $1', [username]);
                if (searchRes.rowCount == 0) return done(null, false);
                let pwdMatch = await bcrypt.compare(password, searchRes.rows[0].userpwd);
                if (!pwdMatch)
                    throw new Error('bad credentials');
                return done(null, searchRes.rows[0])
            } catch (err) {
                done(err, null);
            }
        })
    );
}