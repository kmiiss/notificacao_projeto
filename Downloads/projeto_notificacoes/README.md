# Projeto Notificações Assíncronas (Docker)

Conteúdo:
- backend: Node.js + Express + RabbitMQ consumer
- frontend: Angular + Angular Material (esqueleto)
- docker-compose.yml (rabbitmq, backend, frontend)

Para rodar:
1. Tenha Docker e docker-compose instalados.
2. No diretório raiz (onde está o docker-compose.yml) rode:
   docker-compose up --build

A primeira vez o frontend fará `npm install` e o build pode demorar.

RabbitMQ Management UI: http://localhost:15672 (user: user / pass)
Backend API: http://localhost:3000/api/notificar
Frontend: http://localhost:4200

