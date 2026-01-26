
import { Response } from 'express';

export class BaseRouter {
    private sendResponse(res: Response, resObj: any, statusCode: number) {
        res.status(statusCode).json(resObj);
    }

    protected sendNormalResponse(res: Response, resObj: any) {
        this.sendResponse(res, resObj, 200);
    }

    protected sendServerErrorResponse(res: Response, resObj: any) {
        this.sendResponse(res, resObj, 500);
    }

    protected sendBadRequestResponse(res: Response, resObj: any) {
        this.sendResponse(res, resObj, 400);
    }
}