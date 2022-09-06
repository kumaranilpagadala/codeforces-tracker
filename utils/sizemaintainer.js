const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const Manager = require('../models/problemmanager.js');
const {deleteSingle} = require('./binhelper.js');
const {deleteSingleTodo} = require('./todohelper.js');
const {manageHelper} = require('./managehelper.js');

const maxbinsize=300,maxtodosize=400;


const bincheck = async (username)=>{
    const user=await User.findOne({username:username});
    const arr=user.recentdeleted;
    let cursize=arr.length,pos=0;
    while(cursize>=maxbinsize){
        await deleteSingle(arr[pos],username);
        pos++;cursize--;
    }
};

const todosizecheck = async (username)=>{
    const user=await User.findOne({username:username});
    const arr=user.todo;
    let cursize=arr.length,pos=0;
    while(cursize>=maxtodosize){
        await deleteSingleTodo(username,arr[pos]);
        pos++;cursize--;
    }
    bincheck(username);
};

module.exports = {bincheck,todosizecheck};
