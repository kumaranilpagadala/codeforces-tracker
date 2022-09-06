const axios = require('axios');
const {load} = require('cheerio');
const ExpressError = require('../utils/ExpressError.js');

// const url=`https://codeforces.com/submissions/${handle}`;
const getData= async(handle,start=1,count=1)=>{
    let userData={};
    const submissionsUrl= `https://codeforces.com/api/user.status?handle=${handle}&from=${start}&count=${count}`;
    const outp=await axios.get(submissionsUrl)
    .then((response) => {
            if(response.status === 200) {
                // console.log(response.data.result['0']);
                const contestId = response.data.result['0'].contestId;
                const problem = response.data.result['0'].problem;
                const problemUrl= `/contest/${contestId}/problem/${problem.index}`;
                // console.log(response.data.result['0'].verdict);
                if(response.data.result['0'].verdict){
                    userData.handle = handle.trim();
                    userData.problemStatus = response.data.result['0'].verdict.trim();
                    userData.problemId= problemUrl;
                    userData.problemName = `${problem.index} - `+problem.name.trim();
                }
            }
        }, (error) => {console.log(error)});
    return userData;
    // consol.log(outp);
}


module.exports = {getData};
