const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var state = require('./read');

var data = [];
if (process.env.I_HAVE_BTC) {
  data.push({currency:"btc",balance:parseFloat(process.env.I_HAVE_BTC)})
}
if (process.env.I_HAVE_LTC) {
  data.push({currency:"ltc",balance:parseFloat(process.env.I_HAVE_LTC)})
}
if (process.env.I_HAVE_XRP) {
  data.push({currency:"xrp",balance:parseFloat(process.env.I_HAVE_XRP)})
}
if (process.env.I_HAVE_ETH) {
  data.push({currency:"eth",balance:parseFloat(process.env.I_HAVE_ETH)})
}
if (process.env.I_HAVE_BCH) {
  data.push({currency:"bch",balance:parseFloat(process.env.I_HAVE_BCH)})
}


console.log(data);

function index(req,res) {
  console.log("index render")
  state(data).then((d)=>{
    console.log("state=",d);
    res.render('pages/index',d);
  }).catch(console.error);
}





express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', index)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
