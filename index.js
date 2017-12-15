const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var axios = require('axios');

axios.defaults.baseURL = "https://www.bitstamp.net/api/v2"


function index(req,res) {
  console.log("index render2")
  axios.get("/ticker/bchusd/").then((d)=>{
    console.log(d.data);
    res.render('pages/index');
  }).catch(console.error);
  
}





express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', index)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
