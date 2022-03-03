const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 3000
const db = 'mongodb+srv://Pratham_5200:Pratham@cluster0.lecmi.mongodb.net/BlogDb?retryWrites=true&w=majority'

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

// mongoose.connect('mongodb://localhost:27017/BlogDB');
mongoose.connect(db);


// Schema
const PostSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Title is required"] },
    imageurl: { type: String, required: [true, "Image is Required"] },
    content: { type: String, minlength: [200, "minimum 200 char required"] },
    postDate: { type: Date, default: Date.now },
});

// Model
const Post = mongoose.model('Post', PostSchema);

// let postList = [];

app.get('/', (req, res) => {
    Post.find((err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.render("home", { posts: data });
        }
    })
})
app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/viewpost/:postid', (req, res) => {
    let pid = req.params.postid;
    Post.findById(pid, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.render("viewpost", { post: data });
        }
    })
})
app.get('/newpost', (req, res) => {
    res.render('newpost', { result: '' })
})

app.post('/delpost', (req, res) => {
    // res.render('newpost', { result: '' })
    let pid = req.body.pid;
    Post.findByIdAndDelete(pid, (err) => {
        if (!err) {
            res.render('/newpost', { result: '' })
        }
    })
})

app.get('/editpost/:postid', (req, res) => {
    let pid = req.params.postid;
    Post.findById(pid, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.render("editpost", { post: data, result: '' });
        }
    })
})

app.post('/edit', (req, res) => {
    let pid = req.body.pid;
    const FormData = { title: req.body.title, imageurl: req.body.image, content: req.body.content };
    Post.findByIdAndUpdate(pid, FormData, (err) => {
        if (err) {
            console.error(err);
        } else {
            Post.findById(pid, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    res.render("editpost", { post: data, result: 'Record Updated' });
                }
            })
        }
    })

})
app.post('/new', (req, res) => {
    console.log(req.body);
    const FormData = new Post({ title: req.body.title, imageurl: req.body.image, content: req.body.content });
    FormData.save((err) => {
        if (!err) {
            res.render('newpost', { result: 'Record Saved' })
        } else {
            console.log('Error in Code');
        }
    });
})

app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`)
})