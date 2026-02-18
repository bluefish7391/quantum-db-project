
import { Response } from 'express';
import { User } from '../../frontend/src/kinds';

export function sendResponse(res: Response, resObj: any, statusCode: number) {
	res.status(statusCode).json(resObj);
}

export function isUserArray(rows: any[]): rows is User[] {
	return rows.every(row => typeof row.id === 'number' && typeof row.name === 'string' && typeof row.phone === 'string');
}