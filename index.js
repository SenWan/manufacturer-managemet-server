const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.png0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect();
    const serviceCollection = client.db('manufacture').collection('service');
    const userCollection = client.db('manufacture').collection('users');

    app.put('/user/:email', async(req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = {email: email};
        const options = {upsert: true};
        const updateDoc = {
            $set: user,
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);

    })
    
    app.get('/service', async(req, res)=> {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })
}
finally{

}
}
run().catch(console.dir);


app.get('/', (req,res)=> {
    res.send('Running Manufacturer Management');
});

app.listen(port, () => {
    console.log('listening to port', port);
})