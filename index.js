const express = require("express");
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user : 'blockchain3966@gmail.com',
        pass: '396block!!'      
    }
})


const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/editor.html');
})

app.post('/submit', (req, res) => {
  let mailOptions = {
    from: 'blockchain3966@gmail.com',
    to : `${req.body.user.email}`,
    subject: '396 Blockchain Project',
    text: `Hello dear user! Here's the data you requested: ${req.body.data}`
          
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }
    else{
        console.log(req.body);
        console.log("sent")
        
    }
    
  })
  res.redirect('/editor.html')

});

app.listen(process.env.PORT || 3000, function(){
  console.log(`Started listening on port 3000`)
})


