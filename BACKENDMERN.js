npm i dotenv
npm i mongoose

npm init
 "type": "module", //  for importing in new style
  "scripts": {
    "start": "nodemon index.js       
  }, // to start backend server

// server
import express from "express";
const app = express();

app.listen(8000, () => {
  connect();
  console.log("server is started");
});

// connect to mongoDB
//  uri --> mongodb+srv://apis:apis@clust er0.rmvxyir.mongodb.net/ToDoApp?retryWrites=true&w=majority

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // to access the .env file uri

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

// create a Schema , 

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);


