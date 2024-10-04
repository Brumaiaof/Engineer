import amqp from 'amqplib';
import connectDB from '../rabbitmq/conecctionDb';
import Calculation from '../models/Calculation';

const CALCULATION_QUEUE = 'calculationQueue';
const RESULT_QUEUE_NAME = 'calculationResultQueue';

async function startWorker() {
  try {
    // Conecta ao banco de dados
    await connectDB();

    // Conecta ao RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    // Assegura que as filas existam
    await channel.assertQueue(CALCULATION_QUEUE, { durable: true });
    await channel.assertQueue(RESULT_QUEUE_NAME, { durable: true });

    console.log(` [*] Aguardando mensagens na fila: ${CALCULATION_QUEUE}. Para sair pressione CTRL+C`);

    
    channel.consume(
      RESULT_QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log(' [x] Mensagem de resultado recebida:', messageContent);

          try {
            
            const resultData = JSON.parse(messageContent);

            if (!resultData._id) {
              console.error(' [!] Mensagem recebida sem _id:', messageContent);
              channel.ack(msg); 
              return;
            }

            
            const existingCalculation = await Calculation.findById(resultData._id);
            if (!existingCalculation) {
              console.warn(' [!] Cálculo não encontrado, ignorando:', resultData._id);
              channel.ack(msg);
              return;
            }

            
            existingCalculation.result = resultData.result;
            existingCalculation.status = 'done';
           // existingCalculation.updatedAt = new Date();

            await existingCalculation.save();
            console.log(' [x] Cálculo atualizado com sucesso no banco de dados:', existingCalculation);

            
            channel.ack(msg);
          } catch (error) {
            console.error(' [!] Erro ao processar mensagem de resultado:', error);
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
