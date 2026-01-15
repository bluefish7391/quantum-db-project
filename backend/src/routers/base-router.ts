import { Request, Response } from "express";
import { sendResponse } from "../utility-functions";

export class BaseRouter {
    sendNormalResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 200);
    }

    sendServerErrorResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 500);
    }

    sendBadRequestResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 400);
    }

    sendClientErrorResponse(res: Response, resObj: any, statusCode: number) {
        sendResponse(res, resObj, statusCode);
    }
}