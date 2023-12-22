const express = require("express");
const app = express();
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config(); // import env file if use environment variables after install || npm install dotenv --save|| ane Create a .env file in the root of your project:

const port = process.env.PORT || 5000;

// used Middleware
app.use(cors(
    {
        origin: ['http://localhost:5173','https://newbie--boss.web.app','https://newbie--boss.firebaseapp.com'],
        credentials: true
    }
));
app.use(express.json());

// Connect With MongoDb Database..

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urcdkb0.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect()

        const taskListCollection = client.db('scic-assign-08').collection('taskList');

        app.get('/taskList/:email', async (req, res) => {

            const email = req.params.email;
            console.log("email................................................", email);
            console.log('fasdfasf');
            const query = { email: email };
            const cursor = await taskListCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);


        });
        app.post('/taskList', async (req, res) => {
            const item = req.body;
            const result = await taskListCollection.insertOne(item);
            res.send(result);
        })

        app.delete("/taskList/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await taskListCollection.deleteOne(query);
            res.send(result);
        });


        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await taskListCollection.findOne(query);
            res.send(result);
        })

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    title: data.title,
                    priority: data.priority,
                    deadline: data.deadline,
                    description: data.description,
                    status: data.status,
                    email: data.email
                }
            }
            const result = await taskListCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })


        app.patch('/updateCategory/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body
            console.log(data);
            console.log(id,'from iiiiiiiiiiiiiiiiiii');
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: data.category
                }
            }
            const result = await taskListCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);

// Root Api to check activity
app.get("/", (req, res) => {
    res.send("SCIC is  running!!!");
});
app.listen(port, () => {
    console.log(` listening on port ${port}`);
});