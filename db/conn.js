const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("Database Connected"))
.catch((error)=>{
    console.log("error",error);
})