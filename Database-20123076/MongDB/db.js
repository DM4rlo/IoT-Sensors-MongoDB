const  {MongoClient} = require('mongodb')

let dbConnection

//

module.exports = {
    // establish conncection to database
    connectToDb: (cb) => {
        // connect to db
        MongoClient.connect('mongodb://127.0.0.1:27017/IoT') // connect to local database
        .then((client) =>{
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
             return cb(err)
        })
    },

    // return connection to database
    getDb: () => dbConnection
}