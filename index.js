const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uujg3og.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const studentsCollections = client.db('studyRoom').collection('studentsCollections')
    app.post('/addstudent', async(req, res) =>{
        const student = req.body;
        const result = await studentsCollections.insertOne(student);
        res.send(result);
    } )
    app.get('/student', async(req, res) =>{
        const query = {};
        const result = await studentsCollections.find(query).toArray();
        res.send(result);
    })
    // update 
    app.get('/student/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await studentsCollections.findOne(query)
        res.send(result);
    })
    app.post('/student/:id',async(req, res)=> {
        const data = req.body;
        const {name, age,address, number, student_id} = data;
        console.log(data);
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        const options = {upsert: true}
        const updatedDoc ={
            $set:{
                name,
                age,
                student_id,
                address,
                number
            }
        } 
        const result = await studentsCollections.updateOne(filter,updatedDoc,options)
        res.send(result)
    })

    app.delete('/student/:id',async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await studentsCollections.deleteOne(query);
        res.send(result)
    })



}
run().catch(err => console.err(err))


app.get('/', (req, res) => {
  res.send('study room server is running')
})

app.listen(port, () => {
  console.log(`study room server app listening on port ${port}`)
})