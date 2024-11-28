const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();
const path = require("path")
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const fs = require("fs");

// app.use("/Image",express.static(path.join(__dirname,"/Image")));
app.use("/Image", express.static(path.join(__dirname, "/Image")));


const host = "127.0.0.1";
const port = process.env.PORT || 4000
const Connect=process.env.Connect;
const dataConnect = async () => {
    try {
        const connect = await mongoose.connect(Connect);

        if (connect) {
            console.log("MongoDB Atlas connected successfully!");
            return;
        }
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
};



const userSchema = new mongoose.Schema({
    userImage: {
        type: String
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Image/")
    },
    filename: function (req, file, cb) {
        const imagename = Date.now() + "-" + file.originalname;
        cb(null, imagename);
    }
});
const upload = multer({ storage: storage }).single("userImage");


const userModel = mongoose.model("Image", userSchema);

app.post("/imageUplode", upload, async (req, res) => {
    try {
        const newUser = new userModel({
            userImage: req.file.filename
        });
        await newUser.save();
        res.status(201).send({
            message: "Image add successfull"
        })

    } catch (error) {
        res.send({
            message: error
        })
    }
});


app.get("/imageUplode", async (req, res) => {
    try {
        const getImage = await userModel.find();
        res.json(getImage);
    } catch (error) {
        res.send(error);
    }
});


app.delete("/imageDelete/:id", async(req,res) => {
   
    try {
        const imageId = req.params.id;
        const findImage = await userModel.findById(imageId);
        const imagePath = path.join(__dirname,"Image",findImage.userImage)
        
        fs.unlink(imagePath,(error)=>{
            if(error){
                console.log(error);
            }
        })

        await userModel.deleteOne({
            _id:imageId
        });
        res.send("deleted");
    } catch (error) {
        console.log(error);
    }
});


app.listen(port, host, async () => {
    console.log(`Your server is runnning at http://${host}:${port}`);
    await dataConnect();
});


