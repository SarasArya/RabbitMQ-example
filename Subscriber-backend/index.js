const amqp = require('amqplib/callback_api'),
    socket = require('socket.io'),
    server = require('http').Server(),
    io = require('socket.io')(server),
    async = require('async');


server.listen(3060, () => {
    console.log('listening on port 3060');
});

amqp.connect('amqp://localhost', function(err, conn) {
    const array = ['Cricket', 'Football', 'Tennis', 'Golf', 'Badminton'];
    async.each(array, (item, callback) => {
        conn.createChannel((err, ch) => {
            const q = item;
            ch.assertQueue(q, {
                durable: false
            });
            ch.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, msg => {
                console.log(" [x] Received %s", msg.content.toString());
                console.log(q);
                io.emit(q, {
                    messages: msg.content.toString()
                });
            }, {
                noAck: true
            });
            callback();
        });
    });
});
