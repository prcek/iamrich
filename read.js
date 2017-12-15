



var axios = require('axios');

const pMap = require('p-map');

const testdata = [
    {currency:'btc',balance:0.34852912+0.0010},
    {currency:'ltc',balance:0.49402632+0.2789},
    {currency:'xrp',balance:503.39141834},
    {currency:'eth',balance:0.16384152+0.0990},
    {currency:'bch',balance:0.23273412}
]

function fetchall(data=testdata) {
    return new Promise(function(resolve,reject){
        pMap(data,(x)=>{
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


//fetchall(testdata).then(console.log).catch(console.error);


module.exports = fetchall;