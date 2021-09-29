/*
node index.js \
   --username joao \
   --room sala 2 \
   --hostUri localhost \
*/

import Events from 'events'
import CliConfig from './src/cliConfig.js'
import TerminalController from './src/terminalController.js'
import SocketCLient from './src/socket.js'
const [nodePath, filePath, ...commands] = process.argv
const  config = CliConfig.parseArguments(commands)
console.log(config)
const componentEmitter = new Events

const socketClient = new SocketCLient(config)
await socketClient.initialize()

//const controller = new TerminalController()
//await controller.initializeTable(componentEmitter)