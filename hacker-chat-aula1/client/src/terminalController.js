import ComponentsBuilder from "./components.js";
import { constants } from './constants.js'

export default class TerminalController{
    #usersCollors = new Map()

    constructor(){}
    
    #pickCollor(){
     return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }
    #onInputReceived(eventEmitter){
        return function () {
        const menssage = this.getValue()
        console.log(menssage)
        this.clearValue()
        }
    }

    #getUserCollor(userName){
        if (this.#usersCollors.has(userName)){
            return this.#usersCollors.get(userName)
        }
        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)
        return collor
    }

    #onMessagerReceived({screen, chat}){
        return msg => {
            const { message, userName } = msg
            const collor = this.#getUserCollor(userName)
            
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            
            screen.render()
        }
    }
    #onLogChanged({screen, activityLog}){
      return msg => {
            // joao join
            // joao left 
            const  [userName] = msg.split(/\$/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
            screen.render()
        }
    }
    
    #onStatusChanged({screen, status}){
      return users => {
            // ['joao', 'pedro]
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)
            users.forEach(userName =>{
               const collor = this.#getUserCollor(userName)
               status.addItem(`{${collor}}{bold}${userName}{/}`)
            })
        screen.render()
        }
    }
    #registerEvents(eventEmitter, components){
       eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessagerReceived(components))
       eventEmitter.on(constants.events.app.ACTIVITY_LOG_UPDATED, this.#onLogChanged(components))
       eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }
    async initializeTable(eventEmitter){
       const components = new ComponentsBuilder()
           .setScreen({title: "HackerChat - Gabriel"})
           .setLayoutComponent()
           .setInputComponent(this.#onInputReceived(eventEmitter))
           .setChatComponent()
           .setStatusComponent()
           .setActivityLogComponent()
           .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
       
    }
}