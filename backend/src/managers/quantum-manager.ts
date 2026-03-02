import { exec } from 'child_process';

export class QuantumManager {
	public async runGroverSearch(name: string): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(`python ../../quantum/grover_name_search.py "${name}"`, (error, stdout, stderr) => {
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