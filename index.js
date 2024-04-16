var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/onebytefood')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/sign_in", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.collection('customersignup').findOne({email: email}, (err, user) => {
        if (err) {
            console.log("Error in Server " + err);
            return res.status(500).send('Something went wrong with the server');
        }

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.password === password) {
            console.log("Login in successful")
            return res.redirect('/homepage/homepage.html');
        } else {
            return res.status(401).send('Credentials do not match');
        }
    });
});

app.post("/sign_up",(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var password=req.body.password

    var data={
        "name":name,
        "email":email,
        "password":password
    }
    db.collection('customersignup').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('/homepage/homepage.html');
})

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('signup.html')
}).listen(3001);

console.log("Listening on port 3001")