const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: "String",
  content: "String"
};

const Article = mongoose.model("Article", articleSchema);
app.route('/articles')

.get(function(req, res) {
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  const newArticle = new Article ({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added a new article");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Succesfully deleted all articles");
    }else{
      res.send(err);
    }
  });
});

app.route('/articles/:articleTitle').get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticles){
    if(foundArticles){
      res.send(foundArticles);
    }else{
      res.send("No Articles Found");
    }
  });
})

.put(function(req,res){
  Article.update({title:req.params.articleTitle},
  {title:req.body.title,content:req.body.content},function(err){
  if(!err){
    res.send("Succesfully updated article");
  }else{
    res.send(err);
  }
  }
);
})

.patch(function(req,res){
  Article.update({title: req.params.articleTitle},
  {$set: req.body},function(err){
    if(!err){
      res.send("Succesfully updated article");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Succesfully deleted article");
    }else{
      res.send(err);
    }
  });
})



app.listen(3000 || process.env.PORT, function() {
  console.log("server live port 3000");
});
