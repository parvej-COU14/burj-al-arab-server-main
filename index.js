const express=require('express');
const bodyParder=require('body-parser');
const admin=require('firebase-admin');
const cors=require('cors')
require('dotenv').config()


var serviceAccount = require("./burj-al-arab-de3cf-firebase-adminsdk-w4i4t-9233205a47.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jl6na.mongodb.net/BookingsDetail?retryWrites=true&w=majority`;
const app=express();
app.use(cors());
app.use(bodyParder.json())
const { MongoClient } = require('mongodb');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/',(req,res)=>{
    res.send('Working the project')
})


client.connect(err => {
  const collection = client.db("BookingsDetail").collection("Booking");
  app.post('/addBooking',(req,res)=>{
      const newBooking=req.body;
      collection.insertOne(newBooking)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
      console.log(newBooking)
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
        const idToken = bearer.split(' ')[1];
        admin.auth().verifyIdToken(idToken)
            .then(function (decodedToken) {
                const tokenEmail = decodedToken.email;
                const queryEmail = req.query.email;
                if (tokenEmail == queryEmail) {
                    bookings.find({ email: queryEmail})
                        .toArray((err, documents) => {
                            res.status(200).send(documents);
                        })
                }
                else{
                    res.status(401).send('un-authorized access')
                }
            }).catch(function (error) {
                res.status(401).send('un-authorized access')
            });
    }
    else{
        res.status(401).send('un-authorized access')
    }
})



 });











app.listen(5000)