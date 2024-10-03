//import Fastify from "fastify";
//import cors from "@fastify/cors";
//const app = Fastify({logger: true });  


import express, { Application } from "express";
import calculationRoutes from './routes/calculationRoutes';
import mongoose from 'mongoose';
import cors from "cors";


const app: Application = express();

mongoose.connect("mongodb://127.0.0.1:27017/crud")
.then(() => {
    console.log("Mongo conectado!");
})
.catch((error: any) => {
    console.error("Ocorreu um erro na conexao com o BD :", error);
});

/*app.post('/test', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Dados recebidos com sucesso', data: req.body });
  });*/
  

const PORT = 4000;

app.use(cors()); 

app.use(express.json());

app.use('/api', calculationRoutes);

/*app.get('/api', (req, res) => {
    res.json({ message: 'API encontrada' });
  });*/
  
 



app.listen(PORT, () => {
    console.log(`Rodando na porta: http://localhost:${PORT}`)
});