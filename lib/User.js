const mongoose= require('mongoose');

Schema = mongoose.Schema

var userSchema=new mongoose.Schema({})

var User=mongoose.model('slackUser',userSchema)

module.exports=User
