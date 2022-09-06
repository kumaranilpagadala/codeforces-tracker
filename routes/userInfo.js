const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const userInfo = require('../controllers/userInfo');
const { route } = require('./users');
const {restoreSingle, restoreAll}= require('../utils/binhelper.js');
const { isLoggedIn } = require('../middleware.js');
const{todosizecheck} = require('../utils/sizemaintainer.js');



router.route('/todo')
    .get(isLoggedIn,catchAsync(userInfo.showTodo));
 
router.route('/recent')
    .get(isLoggedIn,catchAsync(userInfo.recentDeleted));

router.route('/deletebin')
    .post(isLoggedIn,catchAsync(userInfo.deleteBin));

router.route('/deleteone')
    .post(isLoggedIn,catchAsync(userInfo.deleteOne));

router.post('/restore',isLoggedIn,async (req,res)=>{
    const{probid}= req.body;
    const{username}= req.params;
    await restoreSingle(probid,username);
    await todosizecheck(username);
    res.redirect(`/${username}/recent`);
})
router.post('/restoreall',isLoggedIn,async (req,res)=>{
    const{probid}= req.body;
    const{username}= req.params;
    await restoreAll(username);
    await todosizecheck(username);
    res.redirect(`/${username}/recent`);
})
router.route('/following')
    .get(isLoggedIn,catchAsync(userInfo.renderFollowing));

router.route('/addfollow')
    .post(isLoggedIn,catchAsync(userInfo.addFollow));

router.route('/unfollow')
    .post(isLoggedIn,catchAsync(userInfo.unFollow));

router.post('/updatetodo',isLoggedIn,catchAsync(userInfo.updateTodo));

router.post('/todo/:probid',isLoggedIn,catchAsync(userInfo.deleteTodo));

module.exports = router;