//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require("mongoose");
const url = "mongodb://127.0.0.1:27017/subhamkr";
mongoose.connect(url).then(() => {
  console.log("Connected to database");
}).catch((e) => {
  console.log("Error connecting to database: " + e);
  
});
const blogs= new mongoose.Schema({
  title:String,
  postBody:String
})
const blogsModel= mongoose.model("blogs",blogs);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
let posts = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  getBlogs();
  async function getBlogs() {
    try {
      const results = await blogsModel.find({});
      const posts = [];
      for (var i = 0; i < results.length; i++) {
        posts.push(results[i]);
      }
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts
      });
    } catch (err) {
      console.log(err);
    }
  }
});
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  })
})
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
})
app.get("/compose", function(req, res) {
  res.render("compose")
})

app.post("/", function(req, res) {
  const post = {
    title: req.body.post,
    postbody: req.body.postBody,
  }
  let Blog=new blogsModel({
    title: post.title,
    postBody: post.postbody
  });
  saveAndFindBlogs();
  async function saveAndFindBlogs() {
    try {
      const savedBlog = await Blog.save();
      console.log("Data is saved");
      res.redirect("/");
    
    } catch (error) {
      console.log(error);
    }
  }
  
    
  
  
  
});
app.post("/delete",function(req,res){
  var id = req.body.checkbox;
  deleteBlog(id);
  async function deleteBlog(id) {
    try {
      await blogsModel.deleteOne({_id: id});
      console.log("Data is deleted");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
  

})
app.get("/post/:topic", function(req, res) {
let test = _.lowerCase(req.params.topic);
posts.forEach(function(post) {
  let subham = _.lowerCase(post.title);
  if (test === subham) {
    res.render("post", {
      title: post.title,
      content:post.postbody,
    })
  }
})


})















app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
