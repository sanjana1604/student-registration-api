const express= require('express');
const mongoose= require('mongoose');

const MONGODB_URI='mongodb://sanjana:sheHacks@shehacks-shard-00-00.emoti.mongodb.net:27017,shehacks-shard-00-01.emoti.mongodb.net:27017,shehacks-shard-00-02.emoti.mongodb.net:27017/registration?ssl=true&replicaSet=atlas-qmjj8g-shard-0&authSource=admin&retryWrites=true&w=majority';
const app= express();


mongoose.connect(MONGODB_URI,{useNewUrlParser:true,  useUnifiedTopology: true});
const con=mongoose.connection
con.on('open',() => {
  console.log('connected')
});

app.use(express.json());
const regisRouter= require('./routes/regis');
app.use('/student',regisRouter);
app.listen(3000, () => {
  console.log('server started');
});