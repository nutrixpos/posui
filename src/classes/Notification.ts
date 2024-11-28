export class Notification {
    id: string
    description: string
    type: string
    topic_name: string
    severity: string
    constructor(){
        this.id = Math.random().toString(16).substring(2, 34)
        this.description = ""
        this.type = ""
        this.topic_name = ""
        this.severity = ""
    }
}


export class OrderFinishNotification extends Notification {
    order_id: string
    constructor(){
        super()
        this.order_id = ""
    }
}