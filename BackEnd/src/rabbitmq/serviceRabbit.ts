import amqp from 'amqplib'; 


class RabbitMQService {
  
  private static connection: amqp.Connection; 
  private static channel: amqp.Channel; 

  
  static async connect() {
    
    if (!this.connection) {
      
      this.connection = await amqp.connect('amqp://guest:guest@localhost:5672'); 
      
      this.channel = await this.connection.createChannel();
    }
  }

  
  static async sendToQueue(queueName: string, message: any) {
    
    if (!this.channel) {
      await this.connect();
    }

    
    this.channel.assertQueue(queueName, { durable: true });
    
    
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true, 
    });
  }
}

export default RabbitMQService; 
