const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const People = require('../../server/models/People');
const validator = require("validator");
const ObjectId = require('mongodb').ObjectID;

// Load Validation:
const validatePeopleInput = require('../../validation/people');

router.get('/test', (req, res) => res.json({ msg: 'People APi Works!' }));

// Get all people
router.get("/allPeople", (req, res) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// Add Person to database:
router.post("/person", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // Validate Inputs:
    const { errors, isValid } = validatePeopleInput(req.body);

    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
      }

    const person = new People({
        firstName: firstName,
        lastName: lastName
    })
    console.log("New Person Info:", person);

    // Add into DB:
    collection.insertOne(person, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        console.log("SAVED!")
        res.send(result.result);
    });
});

// Grab Just one person from DB:
router.get("/person/:id", (req, res) => {
    collection.findOne({ "_id": new ObjectId(req.params.id)}, (error, result) => {
        // For some reaosn error is null? Work around was to check for !result and send custom messages
        if(!result) {
            return res.status(500).send({"msg": "Person Does Not Exist!"});
        }
        res.send(result);
    });
});

router.delete("/person/:id", (req, res) => {
    const ID = req.params.id
    // For some reason Atlas wont send an error if the searched ID doesnt exist..  Must do it this way as a detour.. Basically had to query to see if it exists, then query again to delete.:
    // Check if ID exists in DB:
    collection.findOne({ "_id": new ObjectId(ID)}, (error, result) => {
        // For some reaosn error is null? Work around was to check for !result and send custom messages
        if(!result) {
            return res.status(500).send({"msg": "Person Does Not Exist!"});
        }
        // Delete ID From DB:
        collection.deleteOne({ "_id": new ObjectId(ID)});
        return res.status(201).send({ "msg": "Successfully Deleted!"});
        
    });
});

router.put("/person/:id", (req, res) => {
    const ID = req.params.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const { errors, isValid } = validatePeopleInput(req.body);

    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
      }
    const update = {
        firstName: firstName,
        lastname: lastName
    }
    console.log("Changing Information To The Follow:", update);
    // Add changes to DB By ID
    collection.updateOne({ "_id": new ObjectId(ID)}, {$set: update}, (error, result) => {
        if(!result) {
            // return res.status(500).send(error);
            return res.status(500).send({ "msg": "Failed To Update..."});
        }
        console.log("Successfully Updated!")
        return res.status(200).send({ "msg": "Successfully Updated!"});
        // res.send(result);

    });
});

module.exports = router; 