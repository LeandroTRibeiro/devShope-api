import express, { Request, Response, ErrorRequestHandler } from "express";
import path from "path";
import router from "./routes/routes";
import dotenv from 'dotenv';
import { mongoConect } from "./database/mongo";
import cors from 'cors';
import bodyParser from "body-parser";
import { MulterError } from 'multer';

dotenv.config();

mongoConect();

const server = express();

server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

server.use(express.static(path.join(__dirname, '../public')));

server.use(bodyParser.json());

server.use(router);

server.use((req: Request, res: Response) => {
    res.status(404).json({ error: { endpoint: { msg: `Pagina não encontrada` } } });
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    res.status(400);

    if (error instanceof MulterError) {
        res.json({ error: { image: { msg: error.message } } });
    } else {
        console.log(error);
        res.json({ error: { image: { msg: 'Erro inesperado' } } });
    }

};

server.use(errorHandler);

server.listen(process.env.PORT);
