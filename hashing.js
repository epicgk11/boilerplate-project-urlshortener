const dns = require("dns")

let websites = {}
let count = 0;

const verifyUrl = (url) => {
    const regex = /^https?:\/\//;
    if (!regex.test(url)) {
      return { valid: false, error: "invalid URL format" };
    }
    let tempDnsUrl = url.slice(url.indexOf("//") + 2);
    let slashIndex = tempDnsUrl.indexOf("/");
    let dnsUrl = slashIndex < 0 ? tempDnsUrl : tempDnsUrl.slice(0, slashIndex);
    console.log("slashIndex: " + slashIndex);
    console.log("dnsUrl: " + dnsUrl);  
    return dnsUrl;
  };


const checkFlag = async(url)=>{
    url = verifyUrl(url);
    if(!url || url.valid===false) return {valid:false,error:"invalid url"}
    return new Promise((resolve,reject)=>{
        dns.lookup(url,(error,address,family)=>{
            if(error) return resolve({valid:false,error:error});
            else return resolve({valid:true});
        });
    });
}
const hashinfunction = async (url) =>{
    const lookflag = await checkFlag(url);
    if(!lookflag['valid']){
        return lookflag;
    }
    websites[++count] = url;
    return {valid:true,count};    
}

const getUrl = (shorturl) =>{
    if (shorturl in websites) return {url:websites[shorturl]}
    else return {'error':'url not found'};
}

module.exports = {hashinfunction,getUrl}