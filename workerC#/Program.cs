using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        var factory = new ConnectionFactory()
        {
            HostName = "localhost",
            UserName = "guest",
            Password = "guest"
        };

        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            string queueName = "calculationQueue";
            string responseQueueName = "calculationResultQueue";

            channel.QueueDeclare(queue: queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            channel.QueueDeclare(queue: responseQueueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            Console.WriteLine(" [*] Aguardando mensagens. Para sair, pressione CTRL+C");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                CalculationData? calculationData = null;

                try
                {
                    
                    calculationData = JsonConvert.DeserializeObject<CalculationData>(message);

                    if (calculationData != null)
                    {
                        
                        if (calculationData.status == "done")
                        {
                            Console.WriteLine($" [!] Mensagem já processada, ignorando: {calculationData._id}");
                            channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                            return;
                        }

                        
                        await Task.Delay(5000);

                        
                        int sum = calculationData.number1 + calculationData.number2;

                        
                        var resultData = new
                        {
                            _id = calculationData._id,
                            number1 = calculationData.number1,
                            number2 = calculationData.number2,
                            status = "done",
                            createdAt = calculationData.createdAt,
                            updatedAt = DateTime.UtcNow,
                            result = sum
                        };

                        
                        var resultJson = JsonConvert.SerializeObject(resultData);

                        
                        var responseBytes = Encoding.UTF8.GetBytes(resultJson);
                        channel.BasicPublish(exchange: "",
                                             routingKey: responseQueueName,
                                             basicProperties: null,
                                             body: responseBytes);

                        Console.WriteLine($" [x] Mensagem processada e resultado enviado: {resultJson}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($" [!] Erro ao processar mensagem: {ex.Message}");

                    
                    var errorData = new
                    {
                        _id = calculationData?._id,
                        status = "error",
                        errorMessage = ex.Message
                    };

                   
                    var errorJson = JsonConvert.SerializeObject(errorData);

                    
                    var responseBytes = Encoding.UTF8.GetBytes(errorJson);
                    channel.BasicPublish(exchange: "",
                                         routingKey: responseQueueName,
                                         basicProperties: null,
                                         body: responseBytes);
                }
                finally
                {
                    
                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                }
            };

            channel.BasicConsume(queue: queueName,
                                 autoAck: false,
                                 consumer: consumer);

            Console.WriteLine(" Pressione [enter] para sair.");
            Console.ReadLine();
        }
    }
}

public class CalculationData
{
    public string _id { get; set; }
    public int number1 { get; set; }
    public int number2 { get; set; }
    public string? status { get; set; }
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
}
