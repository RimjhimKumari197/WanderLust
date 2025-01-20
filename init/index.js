//for intiaizing
if(process.env.NODE_ENV!="production"){
  require('dotenv').config();

}
const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const dbUrl=process.env.ATLASDB;

main().then((res)=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}
const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'678e1d69b832b76472d26b2d'}));
    await Listing.insertMany(initdata.data);
    console.log("data initialized");
};
initDB();