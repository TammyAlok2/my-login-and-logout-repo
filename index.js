import express from 'express'
import path from 'path'
import mongoose, { Schema } from 'mongoose'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt'
const port = 3005
const app = express();

const users = []

//Create a database named "mydb":
mongoose
  .connect('mongodb://127.0.0.1:27017/backened', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('database connected'))
  .catch(e => console.log(e))

//making the schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passward:String,
})

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.set('view engine', 'ejs')

app.get('/add', async(req, res) => {
 await Message.create({ name: 'aloktamrakargf', email: 'aloktamrakar2@gmail.com',mobile:'9644905810',passward:'aloktam' });
    res.send('nemc')
  });
 
const isAuthenticated = async(req,res,next)=>{
  const {token} = req.cookies;

  if(token){
 const decoded =jwt.verify( token, "alokloveankita");
 
 req.user =await User.findById(decoded._id);
   next();
  }
  else{
   res.redirect('/login');
  }
}

app.get('/',isAuthenticated, (req, res) => {
  //onsole.log(req.user);
   res.render('logout', {name:req.user.name});
  })
  
  app.get('/logout',(req,res)=>{
    res.cookie("token",null,{
      httpOnly:true,
      expires:new Date(Date.now()),
    });
    res.redirect('/');
  });



  app.get('/register',(req,res)=>{
    res.render('register');
  })

app.get('/login',(req,res)=>{
  res.render('login');
})




app.post('/login', async(req,res)=>{

 
  const {email,passward} =req.body;

  

  let user = await User.findOne({email});
 if(!user){
  return res.redirect('/register');
 } 
 const isMatch = await bcrypt.compare(passward ,user.passward) ; 
 if(!isMatch){
  return res.render('login',{ email,message:"Incorrect Passward"});
 }

 const token =jwt.sign({ _id:user._id },"alokloveankita")
  
    res.cookie("token",token,{
      httpOnly:true,
      expire:new Date(Date.now()+60*1000),
    });
    res.redirect("/")
  });
  



app.post('/register', async(req,res)=>{

  const { name ,email,passward} =req.body;
  
  const hashPassward = await bcrypt.hash(passward,10);
  let user = await User.findOne({email});
  if(user){
    return res.redirect('/login');
  }
   // console.log(req.body);
    user =await User.create({
  name ,
  email,
  passward : hashPassward,
  
  })
  const token =jwt.sign({ _id:user._id },"alokloveankita")
  
    res.cookie("token",token,{
      httpOnly:true,
      expire:new Date(Date.now()+60*1000),
    });
    res.redirect("/")
  });
  


app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
