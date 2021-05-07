# Techgo

## Resumo Sobre
Techgo foi o meu projeto de PIT (Projeto de Inovação Tecnológica) do cotemig, nesse projeto fizemos uma pequena startup que se chamava techgo e ela consistia
basicamente em um aplicativo mobile que facilitava a vida das pessoas que precisavam de adquirir um técnico para consertar algo em sua casa. No caso do techgo ele
iria trabalhar com técnicos de informática para aparelhos eletrônicos e eletricistas para fiações.

## Como Instalar

O projeto consiste em duas pastas atualmente, uma mobile e uma server, a server é o backend (express.js) e a mobile é o frontend mobile (react-native expo). Para instalar
e configurar o ambiente é um pouco trabalhoso então segue o tutorial.

### Backend

* Instale todas as dependências dentro da pasta server, com yarn install;
* Vá até a pasta config e no config.json coloque a configuração para um banco de dados de sua escolha. Siga a documentação do [Sequelize](https://sequelize.org/master/manual/migrations.html#configuration);
* Rode as migrations com yarn sequelize-cli db:migrate;
* Rode as seeds com yarn sequelize-cli db:seed:all;
* Crie um arquivo .env seguindo o .example.env;
* Agora rode o backend em si com yarn run start;

### Frontend

* Instale o expo-cli como dependência global caso não tenha ele yarn global add explo-cli
* Vá até a pasta src/Services, então entre no arquivo api.js e coloque depois do http:// seu ip:porta ex 192.168.0.10:3030
* Rode o comando expo start
* Quando abrir a launch page do expo escaneie o qr code com seu celular no aplicativo [ExpoGo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR&gl=US)
