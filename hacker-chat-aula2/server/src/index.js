import SocketServer from "./socket.js";
import Events from 'events'
import Controller from './controller.js'
import { constants } from "./constants.js";

const eventEmitter = new Events()
/*
async function testServer(){
    const options ={
        port: 9898,
        host: 'localhost',
        headers:{
            Connection: 'Upgrade',
            Upgrade: 'websocket'
        }
    }
    process.on('uncaughtException', function (err) {
    console.log(err);
    });

    const http = await import('http')
    const req = http.request(options)
    req.end()
    
    req.on('upgrade', (res, socket)=>{
        socket.on('data', data =>{
            console.log('client received ', data.toString())
        })
        setInterval(()=>{
           socket.write('Hello')
        }, 500)
    })
}
*/

const port = process.env || 9898
const socketServer = new SocketServer({port})
const server = await socketServer.initialize(eventEmitter)
const controller = new Controller({ socketServer })
eventEmitter.on(constants.event.NEW_USER_CONNECTED, controller.onNewCOnnection.bind(controller))
console.log('socket server is running at', server.address().port)









