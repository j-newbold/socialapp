const passport = require('passport');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/user', async (req, res) => {
    req.user ? res.send(req.user) : res.send({ msg: 'not found', userid: null });
});

router.post('/changename', (req, res) => {
    if (req.user && req.body.newName) {
        pool.query('UPDATE users SET display_name = $1 WHERE userid = $2',
            [req.body.newName, req.user.userid]
        );
        res.sendStatus(200);
    } else {
        res.send({ msg: 'error' })
    }
})

router.get('/allusers', async (req, res) => {
    const result = await pool.query('SELECT userid, username, display_name FROM users');
    res.json(result.rows);
})

router.get('/userswfollows', async (req, res) => {
    var queryStr;
    if (req.user) {
        queryStr = `select 
        u.userid, u.username, u.display_name,
        exists(
            select 1 from follows f
            where u.userid = f.user_followed
            and $1 = f.user_follower
        ) as is_followed
        from users u`;
        const result = await pool.query(queryStr, [req.user.userid]);
        res.json(result.rows);
    } else {
        queryStr = 'SELECT userid, username, display_name, null as is_followed FROM users'
        const result = await pool.query(queryStr);
        res.json(result.rows);
    }
})

router.post('/follow', async (req, res) => {
    try {
        await pool.query(`INSERT INTO follows (user_follower, user_followed)
                                            VALUES ($1, $2)`,
                                        [req.user.userid, req.body.userToFollow]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.delete('/unfollow', async (req, res) => {
    await pool.query(`DELETE FROM follows
                            WHERE user_follower = $1
                            AND user_followed = $2`,
                        [req.user.userid, req.body.userUnFollowed]);
    res.sendStatus(200);
})

module.exports = router;