const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// midaleware
app.use(cors());
app.use(express.json());
// 
// artMaster
// 1M5pvv90f23lATEr
console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmdvppd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const artCollection = client.db('artDB').collection('art')

    app.get('/art', async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/newArt/:id', async (req, res) => {
      const result = await artCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result)
    })

    app.get("/myArt/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await artCollection.find({
        email: req.params.email
      }).toArray();
      res.send(result)
    })

    app.get('/art/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.findOne(query);
      res.send(result);
    })


    app.post('/art', async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt)
      res.send(result);
    })

    app.put('/art/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem = req.body;
      const coffee = {

        $set: {
          name: updatedItem.name,
          subcategory_Name: updatedItem.subcategory_Name,
          short_description: updatedItem.short_description,
          photo: updatedItem.photo,
          price: updatedItem.price,
          rating: updatedItem.rating,
          processing_time: updatedItem.processing_time,
          stockStatus: updatedItem.stockStatus,
          customization: updatedItem.customization

        }

      }
      const result = await artCollection.updateOne(filter, coffee, options);
      res.send(result)
    })



    app.delete('/art/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.deleteOne(query)
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`art server is running${port}`);
})





