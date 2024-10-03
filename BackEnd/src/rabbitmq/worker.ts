import amqp from 'amqplib';
import * as CalculationService from '../services/calculationService'; // Importa os serviços de cálculo
import { ICalculation } from '../models/Calculation'; // Importa a interface para garantir a tipagem correta

const QUEUE_NAME = 'calculationResultQueue';

async function startWorker() {
  try {
    // Conecta ao RabbitMQ
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
            // Desserializa a mensagem
            const calculation = JSON.parse(messageContent);

            // Verifica se o cálculo contém o ID
            if (!calculation._id) {
              console.error(' [!] Mensagem recebida sem _id:', messageContent);
              return;
            }

            // Definir status de forma segura, garantindo que o tipo esteja correto
            const status: ICalculation['status'] = calculation.status as ICalculation['status'];

            // Atualiza o cálculo no MongoDB com os novos dados
            const updatedData: Partial<ICalculation> = {
              result: calculation.result,
              status,
            };

            const updatedCalculation = await CalculationService.updateCalculation(
              calculation._id,
              updatedData
            );

            if (updatedCalculation) {
              console.log(' [x] Cálculo atualizado com sucesso no MongoDB:', updatedCalculation);
            } else {
              console.error(' [!] Falha ao atualizar o cálculo no MongoDB:', calculation._id);
            }

            // Confirma a mensagem como processada
            channel.ack(msg);
          } catch (error) {
            console.error(' [!] Erro ao processar mensagem:', error);
            // Não faz ack da mensagem para reprocessamento ou análise posterior
          }
        }
      },
      {
        noAck: false, // Habilita o "acknowledgment" manual para garantir o processamento
      }
    );
  } catch (error) {
    console.error(' [!] Erro ao iniciar o worker:', error);
  }
}

startWorker();
