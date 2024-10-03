//import Fastify from "fastify";
//import cors from "@fastify/cors";
//const app = Fastify({logger: true });  


import express, { Application } from "express";
import calculationRoutes from './routes/calculationRoutes';
import mongoose from 'mongoose';
import cors from "cors";


const app: Application = express();


const mongoURI = "mongodb://127.0.0.1:27017/crud";
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Mongo conectado!");

        
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Rodando na porta: http://localhost:${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error("Ocorreu um erro na conexao com o BD :", error);
        process.exit(1); 
    });


app.use(cors());
app.use(express.json());
app.use('/api', calculationRoutes);