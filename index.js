require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const {hashinfunction,getUrl} = require("./hashing");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',async (req,res,next)=>{
  const url = req.body['url'];
  const result = await hashinfunction(url);
  if(result['valid']){
    res.json({original_url:url,short_url:result['count']});
  }
  else{
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:shorturl?',(req,res)=>{
  const shorturl = Number(req.params['shorturl']);
  if(isNaN(shorturl) || !('url' in getUrl(shorturl))){
    res.json({'error':'not found'});
  }
  res.redirect(getUrl(shorturl)['url']);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
