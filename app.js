require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const encrypt = require('mongoose-encryption');
const app = express();
const lodash = require('lodash');
var md5 = require('md5');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

///////////// connect and define database
const mongoose = require('mongoose');
const { title } = require('process');
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost:27017/user_secret', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new Schema({
    email: String,
    password: String
});

console.log(process.env.SECRET);
//////////////////encrypt///////////////////////////

//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);
let vasy = new User({
    email: 'hello@kitty.com',
    password: '1234ilovemycat'
});
//vasy.save().then(console.log("vasy was saved to db"));

app.get('/', (req, res) => {
    res.render('home');
});

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        let userEmail = req.body.username;
        let userPassword = md5(req.body.password);
        console.log(userEmail, userPassword);
        User.find({
            email: userEmail,
            password: userPassword
        }, (err, doc) => {
            if(err){
                console.log(err);
            }else{
                console.log('XXXXXXXXXXXXX', doc);
                if(doc){
                    res.render('page');
                }else{
                    res.send('wrong username or password!')
                }                
            }
        });
    });

app.get('/register', (req, res) => {
    res.render('register');
});

// app.get('/secrets', (req, res) => {
//     res.render('/secrets');
// })

app.post('/register', (req,res) => {
    let user = new User ({
        email: req.body.username,
        password: md5(req.body.password)
    });
    user.save().then(() => {
        console.log(user, '   saved to db');
        res.render('page');
    });
})















app.listen(3000, () => console.log('Server is running on port 3000.'));