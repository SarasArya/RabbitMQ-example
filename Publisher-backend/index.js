const socket = require('socket.io'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    amqp = require('amqplib/callback_api');


function sendMessage(obj) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = obj.topic;
            var msg = obj.message;

            ch.assertQueue(q, {
                durable: false
            });
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(q, Buffer.from(msg), {persistent : false});
            console.log(" [x] Sent %s", msg);
        });
    });
}

app.set('port', 3040);

server.listen(app.get('port'), () => {
    console.info(`Server listening at port ${app.get('port')} in ${process.env.NODE_ENV} mode`);
});
//To get data from REST API
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('*', (req, res, next) => {
    let origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.post('/publish', (req, res) => {
    console.log(req.body);
    sendMessage(req.body);
    res.sendStatus(200);
});
