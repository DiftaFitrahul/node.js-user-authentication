import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.disable('x-powered-by');

const port = 8080;

/**HTTP get */

app.get('/', (req, res) => {
    res.status(200).json({'message' : 'OK'});
})

/**Connect to Server only when connected to mongodb */

connect().then(() => {
    try{
        app.listen(port, (err, server) => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    } catch(err) {
        console.error(`Can't connect to the server: ${err.message}`);
    }
}).catch(err => {
    console.log(`Invalid database connection...! : ${err.message}`);
})





