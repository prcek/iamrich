const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var state = require('./read');


function index(req,res) {
  console.log("index render")
  state().then((d)=>{
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
