const passport = require('passport');
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const supabase = require('../config/supabaseClient');

const saltRounds = 10;

router.post("/login", passport.authenticate("local", { failureRedirect: '/login' }),
    function(req, res) {
    res.sendStatus(200);
});

router.post("/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
	req.logout((err) => {
		if (err) return res.sendStatus(400);
		res.sendStatus(200);
	});
})

router.post('/signup', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        let hashed_password = bcrypt.hashSync(req.body.password, salt);
/*         pool.query('insert into users (username, userpwd, display_name) values ($1, $2, $3)',
            [req.body.username, hashed_password, req.body.displayName]
        ); */
        const { error } = supabase
            .from('users')
            .insert({
                username: req.body.username,
                userpwd: hashed_password,
                display_name: req.body.displayName
            })
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

router.delete("/deleteacc", async (req, res) => {
/*     pool.query(`DELETE FROM users
        WHERE userid = $1`,
    [req.user.userid]); */
    const response = await supabase
        .from('users')
        .delete()
        .eq('userid',req.user.userid);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    });
});

module.exports = router;