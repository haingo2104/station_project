export class ClientError extends Error {
    constructor (message , code = 400){
        super(message)
        code = code
    }
}

export class ServerError extends Error {
    constructor (message , code = 500){
        super(message)
        code = code
    }
}

export class ForbiddenError extends Error {
    constructor (message){
        super(message , code = 401)
        code = code
    }
}

export class NotFoundError extends Error {

    constructor (message,  code= 404){
        super(message)
        code = code
    }
}