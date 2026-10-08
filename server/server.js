const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:" , error);
    });



app.get("/", (req,res) => {
    res.send("Server is running!");
});



app.get("/students" , async(req,res)=>{
    try{
        const students = await Student.find();
        res.json(students);
    }catch(error){
        res.status(500).json({message:"Erorr in fetching the data", error});
    }
});


app.post("/students", async(req,res) =>{
    try{
        const student = new Student({
            name: req.body.name,
            course: req.body.course,
            age: req.body.age,   
        });
        
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    }catch(error){
        res.status(500).json({message:"Erorr save student", error});
    }
});


app.put("/students/:id", async(req,res) =>{
    try{
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {name: req.body.name,
            course: req.body.course,
            age: req.body.age},
            {new:true}
        );

        if(!updatedStudent){
            return res.status(404).json({message:"Error updating"});
        } res.json(updatedStudent);

    }catch(error){
        res.status(500).json({message:"Erorr updating student", error});
    }
});

app.delete("/students/:id", async(req,res) =>{
    try{
        const deletedStudent = await Student.findByIdAndDelete(req.params.id)

        if(!deletedStudent){
            return res.status(404).json({message:"Error deleting"});
        } res.json({message:"deleted!"});

    }catch(error){
        res.status(500).json({message:"Erorr deleting student", error});
    }
});



app.listen(5001, () => {
    console.log("Server running on port 5001");
})

