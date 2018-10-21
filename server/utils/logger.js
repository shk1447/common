const path = require('path')
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const logDir = path.resolve('./log');
const logFileName = path.resolve(logDir, './logfile.log');

const { combine, timestamp, printf } = winston.format;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const myFormat = printf(info => {
    return `${info.timestamp} [${info.level}] : ${info.message}`;
});
  
var logger = winston.createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new (winston.transports.Console)({
            level:'info',
            colorize:true
        }),
        new (winston.transports.DailyRotateFile)({
            name: 'dailyInfoLog',
            filename: logFileName,
            maxSize:10485760,//10mb
            maxFiles:10//10개
        })
    ]
});

module.exports = logger;
