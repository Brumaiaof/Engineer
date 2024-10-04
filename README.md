
# Banco de Dados

Baixar o MongoDb Compass https://www.mongodb.com/try/download/compass.

Host e Porta: Por padrão, o MongoDB roda em localhost na porta 27017. Digite mongodb://localhost:27017 no campo "Connection String" para conectar-se ao MongoDB rodando localmente.
Iniciar o MongoDB como Serviço no Windows
Executar como Administrador e inserir o comando "net start MongoDB" para iniciar

# Atenção
No VSC abra 3 terminais um para executar a pasta back , uma para a pasta front e outro para a pasta back executar o worker , simultaneamente enquanto o worker c# depura no Visual Studio.

# BackEnd

Abrir pelo terminal a pasta BackEnd e inserir o comando  "npm start" para executar.

# FrontEnd

Abrir um novo terminal a pasta FrontEnd e inserir o comando "ng serve" para executar .
o link para inserir no browser http://localhost:4200/calculation e visualizar o front.

# worker Rabbit 
Instalar o Erlang https://www.erlang.org/downloads *marcar PATH .

Instalar o rabbit https://www.rabbitmq.com/docs/install-windows

Como administrador executar no prompt "rabbitmq-plugins enable rabbitmq_management"
Depois o comando "rabbitmq-server" para iniciar

No browser abrir http://localhost:15672/   Username:Guest Password:Guest 

Abrir um novo terminal na pasta BackEnd e inserir o comando  "npx ts-node src/rabbitmq/worker.ts" para executar.

# Consumer C#

Abrir o projeto no Visual Studio, e executar com o botao de "play"na barra superior.


