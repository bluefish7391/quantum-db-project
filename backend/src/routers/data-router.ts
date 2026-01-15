import { BaseRouter } from "./base-router";
import express, { Response, Request } from "express";

export class DataRouter extends BaseRouter {
    async getData(req: Request, res: Response) {
        this.sendNormalResponse(res, { message: "GET request received" });
    }

    async search(req: Request, res: Response) {
        const { query } = req.body;
        this.sendNormalResponse(res, { message: `Search query received: ${query}` });
    }

    buildRouter() {
        const dataRouter = new DataRouter();
        return express.Router()
            .get('/data', dataRouter.getData.bind(dataRouter))
            .post('/search', dataRouter.search.bind(dataRouter));
    }
}