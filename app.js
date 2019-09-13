const   bodyParser = require("body-parser"),
        methodOverride = require("method-override"),
        mongoose = require("mongoose"),
        express = require("express"),
        expressSanitizer = require("express-sanitizer"),
        moment = require("moment");
        app = express();

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.locals.moment = moment;

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

// INDEX 
app.get("/blogs",(req, res)=>{
    Blog.find({}, (err, el)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:el});
        }
    })
});

// NEW
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

// CREATE
app.post("/blogs",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create blog
    Blog.create(req.body.blog, (err, el)=>{
        if(err){
            res.render("new");
        } else{
              // redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id, (err, el)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show",{blog:el});
        }
    })
});

//EDIT
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id, (err, el)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit",{blog:el});
        }
    });
});

//UPDATE
app.put("/blogs/:id",(req,res)=>{
    // santize req.body.blog.body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE
app.delete("/blogs/:id", (req,res)=>{
    // destroy blog
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    // redirect somewhere
});

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});





app.listen(3001,()=>{
    console.log("Server is runnning...");
});
      