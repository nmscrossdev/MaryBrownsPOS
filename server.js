'use strict';
var path = require('path');
var express = require('express');

var app = express();

//Static file declaration
app.use(express.static(path.join(__dirname, '/')));

//production mode
if(process.env.NODE_ENV === 'production') {
 
  app.use(express.static(path.join(__dirname, '/')));
  //
  app.get('*', (req, res) => {
  
    res.sendfile(path.join(__dirname = 'index.html'));
  })
}
//build mode
app.get('*', (req, res) => {
 
  res.sendFile(path.join(__dirname+'/index.html'));


})




// app.use(express.static(path.join(__dirname, '/')));
// app.get('*', (req,res) =>{
//     //console.log("staticPath",res);
//   //  console.log("staticPath12",req);

//     res.sendFile(path.join(__dirname+'/index.html'));
// });



app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    //console.log('listening');
});