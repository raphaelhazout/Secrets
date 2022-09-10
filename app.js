require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
 
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email:String,
    password:String
});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const newUser = new User({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
        if(!err)
            res.render("secrets");
        else
            console.log(err);
        });
    });
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(!err){
            if(foundUser){
                bcrypt.compare(password, foundUser.password).then(function(result) {
                    if(result){
                        res.render("secrets");
                    }
                    else {
                        res.send("Wrong Password!");
                    }
                });
            }
            else {
                res.send("Wrong Email!");
            }
        }
        else {
            console.log(err);
        }
    })
});
  


app.listen(process.env.PORT || 3000, () => console.log("Server started at port: 3000")
);