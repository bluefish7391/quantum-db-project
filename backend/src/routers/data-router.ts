import express, { Router, Request, Response } from 'express';
import { DataManager } from '../managers/data-manager';
import { ApiResponse, User } from '../../../frontend/src/kinds';
import { BaseRouter } from './base-router';

export class DataRouter extends BaseRouter {
	private dataManager: DataManager;
	private constructor(dbPath: string) {
		super();
		this.dataManager = new DataManager(dbPath);
	}

	private async getAllUsers(req: Request, res: Response) {
		try {
			const data = await this.dataManager.getAllUsers();
			this.sendNormalResponse(res, data);
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	private async upsertUser(req: Request, res: Response) {
		const user = req.body as User;
		if (!user.name || !user.phone) {
			const apiResponse = new ApiResponse();
			apiResponse.success = false;
			apiResponse.message = 'Name and phone are required';

			this.sendBadRequestResponse(res, apiResponse);
			return;
		}
		try {
			user.id = await this.dataManager.upsertUser(user);
			this.sendNormalResponse(res, user);
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	private async clearUsers(req: Request, res: Response) {
		try {
			await this.dataManager.clearUsers();
			this.sendNormalResponse(res, { success: true, message: 'All users cleared' });
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	private async checkNameExists(req: Request, res: Response) {
		const name = req.params.name as string;
		try {
			const exists = await this.dataManager.checkNameExists(name);
			this.sendNormalResponse(res, exists);
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	private async getIDbyName(req: Request, res: Response) {
		const name = req.params.name as string;
		try {
			const id = await this.dataManager.getIDByName(name);
			this.sendNormalResponse(res, id);
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	private async deleteUser(req: Request, res: Response) {
		const id = Number(req.params.id as string);
		try {
			const response = await this.dataManager.deleteUser(id);
			this.sendNormalResponse(res, response);
		} catch (err: any) {
			this.sendServerErrorResponse(res, { success: false, message: err.message });
		}
	}

	static buildRouter(dbPath: string): Router {
		const dataRouter = new DataRouter(dbPath);

		return express.Router()
			.get('/get-all-users', dataRouter.getAllUsers.bind(dataRouter))
			.post('/upsert-user', dataRouter.upsertUser.bind(dataRouter))
			.get('/clear-users', dataRouter.clearUsers.bind(dataRouter))
			.get('/check-name-exists/:name', dataRouter.checkNameExists.bind(dataRouter))
			.get('/get-id-by-name/:name', dataRouter.getIDbyName.bind(dataRouter))
			.delete('/delete-user/:id', dataRouter.deleteUser.bind(dataRouter));
	}
}