var passport = require('passport');
var Strategy = require('passport-local');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const supabase = require('../config/supabaseClient.js');

passport.serializeUser((user, done) => {
    return done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
    try {
        //const searchRes = await pool.query('select * from users where userid = $1', [id]);
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('userid', id);
        if (data.length == 0) throw new Error('user not found');
        return done(null, data[0]);
    } catch (error) {
        return done(error, null);
    }
})

module.exports = (passport) => {
    passport.use(
        new Strategy(async (username, password, done) => {
            try {
                //const searchRes = await pool.query('select * from users where username = $1', [username]);
                const { data, error } = await supabase
                    .from('users')
                    .select()
                    .eq('username', username);
                if (data.length == 0) return done(null, false);
                let pwdMatch = await bcrypt.compare(password, data[0].userpwd);
                if (!pwdMatch)
                    throw new Error('bad credentials');
                return done(null, data[0])
            } catch (err) {
                done(err, null);
            }
        })
    );
}