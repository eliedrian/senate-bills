import { Pool, QueryResult } from 'pg';

import Bill from './Bill';
import Bills from './Bills';
import CachedPgBill from './CachedPgBill';
import NullBill from './NullBill';

class PgBills implements Bills {
	private pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	bill(congress: number, number: number): Promise<Bill> {
		return new Promise<Bill>((resolve, reject) => {
			return this.pool.query('SELECT * FROM bill WHERE congress = $1 AND number = $2', [congress, number])
				.then(result => {
					if (result.rows.length === 0) {
						return resolve(new NullBill());
					}
					return resolve(new CachedPgBill(result.rows[0]));
				});
		});
	}

	congress(congress: number, page: number): Promise<Array<Bill>> {
		return new Promise<Array<Bill>>((resolve, reject) => {
			return this.pool.query('SELECT * FROM bill WHERE congress = $1 ORDER BY number ASC OFFSET $2 LIMIT $3', [congress, (page - 1) * 10, 10])
				.then(result => {
					if (result.rows.length === 0) {
						return resolve([]);
					}
					return resolve(result.rows.map(r => new CachedPgBill(r)));
				});
		});
	}

	page(page: number): Promise<Array<Bill>> {
		return new Promise<Array<Bill>>((resolve, reject) => {
			return this.pool.query('SELECT * FROM bill ORDER BY congress ASC, number ASC OFFSET $1 LIMIT $2', [(page - 1) * 10, 10])
				.then(result => {
					if (result.rows.length === 0) {
						return resolve([]);
					}
					return resolve(result.rows.map(r => new CachedPgBill(r)));
				});
		});
	}
}

export default PgBills;
