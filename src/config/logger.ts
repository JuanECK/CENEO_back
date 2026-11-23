import winston, {info} from 'winston';

const levels = {
    error:0,
    warning:1,
    info:2,
    http:3,
    debug:4,
}

const colors = {
    error:'red',
    warning:'yellow',
    info:'green',
    http:'magenta',
    debug:'white',
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({format: 'DD-MM-YYYY hh:mm A '}),
    winston.format.colorize({all: true}),
    winston.format.printf((info) => `[${info.timestamp}] [${info.level.toLocaleUpperCase()}]: ${info.message}`)
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level:'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
]

export const logger = winston.createLogger({
    level:'debug',
    levels,
    format,
    transports,
})