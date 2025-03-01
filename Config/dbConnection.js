import mongoose from "mongoose";
export const connectDb = async() => {
    const URI = process.env.Mongdb_URI
    try {
        const name=await mongoose.connect(URI);
        console.log("DB Connected Successfully!!!",name.connection.host);
    } catch (error) {
        console.log("Error in DB Connection",error.message);
    }
}