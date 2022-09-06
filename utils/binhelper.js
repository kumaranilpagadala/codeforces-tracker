const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const Manager = require('../models/problemmanager.js');



const deleteSingle = async (probid,username)=>{
    const inmanage=await Manager.findOne({problemId:probid});
    // console.log(probid);
    const curfr=inmanage.frequency;
    await User.updateOne({username:username},{$pull:{recentdeleted: probid}});
    if(curfr === 1){
        await Manager.deleteOne({problemId:probid});
        await Problem.findByIdAndDelete(probid); 
    }else{
        await Manager.updateOne({problemId:probid},{$set:{frequency:(curfr-1)}});
    }
}

const restoreSingle = async (probid,username)=>{
    await User.updateOne({username:username},{$push:{todo:probid}});
    await User.updateOne({username:username},{$pull:{recentdeleted:probid}});
}
const deleteAll = async(username)=>{
    const user=await User.findOne({username:username});
    const arr=user.recentdeleted;
    arr.forEach(async (probid,i)=>{
        await deleteSingle(probid,username);
    })
}
const restoreAll = async(username)=>{
    const user=await User.findOne({username:username});
    const arr=user.recentdeleted;
    arr.forEach(async (probid,i)=>{
        await restoreSingle(probid,username);
    })
}
module.exports = {deleteAll,deleteSingle,restoreSingle,restoreAll};
