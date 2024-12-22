const passport = require('passport');
const express = require('express');
const router = express.Router();
const pool = require('../db');
const supabase = require('../config/supabaseClient');

router.post('/createpost', async (req, res) => {
    if (req.user && req.body) {
/*         pool.query(`INSERT INTO posts(author_id, post_title, post_body, post_date) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0))`,
            [req.user.userid, req.body.title, req.body.postBody]
        ); */
        var currentTimestamp = new Date().toISOString();
        const { error } = await supabase
            .from('posts')
            .insert({
                author_id: req.user.userid,
                post_title: req.body.title,
                post_body: req.body.postBody,
                post_date: currentTimestamp
            })
        res.sendStatus(200);
    } else {
        res.send({ msg: 'error' });
    }
})

router.get('/posts', async (req, res) => {
    if (req.user) {
        //console.log('user found');
/*         const query = `SELECT *
            FROM posts p
            LEFT JOIN follows f
            ON p.author_id = f.user_followed
            WHERE f.user_follower = $1;`
        const result = await pool.query(query, [req.user.userid]); */
        const { data, error } = await supabase
            .rpc('get_posts', {
                user_follower_id: req.user.userid
            })
        //console.log(data);
        res.json(data);
    } else {
/*         const result = await pool.query(`select post_id, post_title, post_body, post_date, usr.display_name as post_author from posts
            left join users usr
            on usr.userid = author_id;`, []); */
        const { data, error } = await supabase.rpc('get_all_posts');
        res.json(data);
    }
})

router.delete('/post', (req, res) => {
    if (req.user) {
/*         pool.query(`DELETE FROM posts
                        WHERE post_id = $1`,
                        [req.body.postId]); */
        const { error } = supabase
            .from('posts')
            .delete()
            .eq('id', req.body.postId);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;