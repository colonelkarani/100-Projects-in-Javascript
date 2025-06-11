const express = require  ('express');
const path = require ('path');
const bcrypt = require ('bcrypt');
const collection = require('./config');

const app = express();
//convert data into JSON
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//use ejs as the view engine
app.set('view engine', 'ejs')
// static folder path
app.use(express.static("public"))

app.get('/', (req, res)=>{
    res.render("login");
})

app.get('/signup', (req,res)=>{
    res.render('signup');
})

app.get ('/notfound', (req,res)=>{
    res.render('notfound')
})


app.post('/signup',async (req,res) =>{
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await collection.findOne({name : data.name})
    if (existingUser){
        res.redirect('/notfound')
    }else{
    const raundi = 11;
    const hashedPassword =await bcrypt.hash(data.password, raundi);

    //replace password
    data.password = hashedPassword;

    const userdata = await  collection.insertMany(data);
    console.log(userdata)
    res.redirect('/')
}});

app.post('/login', async (req,res)=>{
    
    try {
        const  check = await collection.findOne({name: req.body.username});
        if (!check){
           res.send(" username cannot be found")
        }else{
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch){
                res.render('admin')
            }else(res.send("wwrong password"))
        }

    } catch (error) {
        console.log('sijui rada msee hio password ni kama siiioni bannnna')
    }
})
    

const PORT = 5080;
app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`);
})


