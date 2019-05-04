const express = require("express");
const app =  express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
// npm i --S mongodb     <---- To install new mongo atlas

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Load routes:
const people = require("./routes/api/people");

// Routes:
app.use("/api/people", people);
// require("./server/config/routes")(app);//

// DB Config:
const CONNECTION_URL = require("./server/config/keys_dev").mongoURI
const DATABASE_NAME = "traversyrestapi";
const COLLECTION_NAME = "people";

// Mongo atlas set up:
app.listen(port, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection(COLLECTION_NAME);
        console.log("Connected to DataBase:", DATABASE_NAME);
    });
});