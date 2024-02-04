    const express = require('express')
const {ObjectId} = require('mongodb')
const {getDb, connectToDb} = require('./db')

// init app & middleware
const app = express()
app.use(express.json({ limit: '10mb' }))

let db
// db connection
connectToDb((err) => {
    if(!err){
        // listening for requests
        app.listen(3000, () => {
            console.log('App listening on port 3000')
        })
        // returns the db connection object for CRUD operations
        db = getDb()
    }
})


// routes
app.get('/devices', (req, res) => {
    let devices = []

    // specifying collection
    db.collection('devices')
        .find() //cursor = points to the collection of docs, toArray (docs into array) or forEach (iterates the docs 1 at a time)
        .sort({name: 1}) // sorting alphabetically 
        .forEach(device => devices.push(device)) // each device is pushed on device array
        .then(() => {
            res.status(200).json(devices)
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch the documents"})
        })
})

// getting 1 device by id
app.get('/devices/:id', (req, res) => {
    
    db.collection('devices')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({err: "Could not fetch document!"})
        })
})


app.post('/devices', (req, res) =>{
    const device = req.body

    db.collection('devices')
        .insertOne(device)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err =>{
            res.status(500).json({err: "Could not create a new document."})
        })
})

app.delete('/devices/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('devices')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not delete document"});
        });
    } else res.status(500).json({error: "invalid Id"});

})

app.patch("/devices/:id", (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('devices')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not update document"});
        });
    } else res.status(500).json({error: "invalid Id"});
})