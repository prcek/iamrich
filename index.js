const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


var balance_data = [];
if (process.env.I_HAVE_BTC) {
  balance_data.push({currency:"btc",balance:parseFloat(process.env.I_HAVE_BTC)})
}
if (process.env.I_HAVE_LTC) {
  balance_data.push({currency:"ltc",balance:parseFloat(process.env.I_HAVE_LTC)})
}
if (process.env.I_HAVE_XRP) {
  balance_data.push({currency:"xrp",balance:parseFloat(process.env.I_HAVE_XRP)})
}
if (process.env.I_HAVE_ETH) {
  balance_data.push({currency:"eth",balance:parseFloat(process.env.I_HAVE_ETH)})
}
if (process.env.I_HAVE_BCH) {
  balance_data.push({currency:"bch",balance:parseFloat(process.env.I_HAVE_BCH)})
}


var axios = require('axios');
const pMap = require('p-map');


console.log("balance data",balance_data);


function fetch_my_richness() {
  return new Promise(function(resolve,reject){
      pMap(balance_data,(x)=>{
          return new Promise(function(resolve,reject){
              axios.get("https://www.bitstamp.net/api/v2/ticker/"+x.currency+"usd/").then((r)=>{
                  r.data.last = parseFloat(r.data.last);
                  r.data.bid = parseFloat(r.data.bid);
                  r.data.vwap = parseFloat(r.data.vwap);    
                  r.data.volume = parseFloat(r.data.volume);
                  r.data.timestamp = parseInt(r.data.timestamp);
                  r.data.ask = parseFloat(r.data.ask);
                  r.data.open = parseFloat(r.data.open);
                  r.data.low = parseFloat(r.data.low);
                  r.data.high = parseFloat(r.data.high);
                  resolve({currency:x.currency,balance:x.balance,
                      last_value:x.balance*r.data.last,
                      high_value:x.balance*r.data.high,
                      low_value:x.balance*r.data.low,
                      open_value:x.balance*r.data.open,
                      info:r.data});
              }).catch(reject);
          });
      }).then((ar)=>{
          const reducer = (acc,item) => {
              acc.last_value=acc.last_value+item.last_value;
              acc.high_value=acc.high_value+item.high_value;
              acc.low_value=acc.low_value+item.low_value;
              acc.open_value=acc.open_value+item.open_value;
              return acc;
          };
          const s = ar.reduce(reducer,{last_value:0,open_value:0,low_value:0,high_value:0});
          axios.get("https://api.fixer.io/latest?symbols=USD,CZK").then((cuc)=>{
              resolve({sum:s,list:ar,usd2czk:cuc.data.rates.CZK/cuc.data.rates.USD}); 
          }).catch(reject);
      }).catch(reject)
  });
}



function index(req,res) {
  console.log("balance data",balance_data);
  fetch_my_richness().then((d)=>{
    console.log("state=",d);
    res.render('index',d);
  }).catch(console.error);
}





express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', index)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
