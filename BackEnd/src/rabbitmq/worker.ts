import amqp from 'amqplib';
import { updateCalculation } from '../controllers/calculationControllerService'; 
import connectDB from '../rabbitmq/conecctionDb'; 
import Calculation from '../models/Calculation'; 

const QUEUE_NAME = 'calculationResultQueue';

async function startWorker() {
  try {
    
    await connectDB();

    
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(` [*] Aguardando mensagens na fila: ${QUEUE_NAME}. Para sair pressione CTRL+C`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log(' [x] Mensagem recebida:', messageContent);

          try {
            
            const calculation = JSON.parse(messageContent);

            
            if (!calculation._id) {
              console.error(' [!] Mensagem recebida sem _id:', messageContent);
              channel.ack(msg); 
              return;
            }

            
            const existingCalculation = await Calculation.findById(calculation._id);
            if (existingCalculation && existingCalculation.status === 'done') {
              console.warn(' [!] Cálculo já foi processado, ignorando:', calculation._id);
              channel.ack(msg); 
              return;
            }

            
            const updatedData = {
              result: calculation.result,
              status: calculation.status as 'done' | 'pending' | 'error', 
            };

            
            const req = {
              params: { id: calculation._id },
              body: updatedData,
            };
            const res = {
              json: (response: any) => console.log(' [x] Resposta do updateCalculation:', response),
              status: (code: number) => ({
                json: (response: any) => console.error(`[!] Status ${code}:`, response),
              }),
            };

            await updateCalculation(req as any, res as any); 

            
            channel.ack(msg);
          } catch (error) {
            console.error(' [!] Erro ao processar mensagem:', error);
            
          }
        }
      },
      {
        noAck: false, 
      }
    );
  } catch (error) {
    console.error(' [!] Erro ao iniciar o worker:', error);
  }
}

startWorker();
