import axios from "axios";
import express, { urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";



const app = express();
config({path:"./config/config.env"});


app.use(cors({
    origin :[process.env.FRONTEND_URL],
    methods :["POST","GET","PUT"],
    credentials : true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/convert",async (req,res)=>{
    const {base_currency,currencies} = req.query;
    try {        
        const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY}&base_currency=${base_currency}&currencies=${currencies}`
        const response = await axios.get(url);
        return res.json(response.data);
    } catch (error) {
        console.log("Error fetching data",error.message,error.response?.data);
        res.status(500).json({
            message: "Error fetching data"
        })
    }
})
app.listen(process.env.PORT || 4000,()=>{    
    console.log(`server is running in port ${process.env.PORT}`);
});
export default app;