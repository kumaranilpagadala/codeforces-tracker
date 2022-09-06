const axios = require('axios');

const checkUser= async (handle)=>{
    const url=`https://codeforces.com/api/user.info?handles=${handle}`;
    const outp=await axios.get(url)
                    .then((response) => {
                        return true;
                    }, (error) =>{ return false} );
    return outp;
    // console.log(outp);
}

module.exports = {checkUser};