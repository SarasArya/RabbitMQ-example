This task is divided into 4 folders. 
Publisher backend
Publisher frontend
Subscriber frontend 
Subscriber backend

For message queue I will be using RabbitMQ's node js library. for inter backend communication and socket.io for my server to brower communication. 
For the application to run you should have rabbit mq server installed and running which will be incharge of handling the communication. Here are the links to [install](https://www.rabbitmq.com/download.html) and [run](https://pubs.vmware.com/vfabric53/index.jsp?topic=/com.vmware.vfabric.rabbitmq.3.2/getstart/install-start-server-ubuntu.html) the rabbit mq server. Once this is done. Head over to backend and node index.js/ npm start should start the backend and for frontend bower install the dependencies and run each frontend on live-server.