import { exec } from 'child_process';

export class QuantumManager {
	public async runGroverSearch(query: string): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(`python ../../quantum/grover.py "${query}"`, (error, stdout, stderr) => {
				if (error) {
					console.error(`Error: ${stderr}`);
					reject(error);
				} else {
					resolve(stdout.trim());
				}
			});
		});
	}
}