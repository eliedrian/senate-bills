import {Router} from 'express';
import Bills from '../bill/Bills';
import ExpressRouter from './ExpressRouter';
import Path from '../path/Path';
import DefaultBillJson from '../bill/DefaultBillJson';

class BillExpressRouter implements ExpressRouter {
	private _path: Path;
	private bills: Bills;

	constructor(path: Path, bills: Bills) {
		this._path = path;
		this.bills = bills;
	}

	router(): Router {
		const router = Router();

		router.get('/congress/:congress/bills/:number', (request, response) => {
			// single bill get
			const congress = parseInt(request.params.congress, 10);
			const number = parseInt(request.params.number, 10);
			this.bills.bill(congress, number).then(bill => {
				response.json(new DefaultBillJson(bill).value());
			});
			// db access
		});

		router.get('/bills', (request, response) => {
			const page = request.query.page ? request.query.page.toString() : '0';
			this.bills.page(parseInt(page, 10) || 1).then(bills => {
				response.json(bills.map(b => new DefaultBillJson(b).value()));
			});
		});

		router.get('/congress/:congress/bills', (request, response) => {
			const congress = parseInt(request.params.congress, 10);
			const page = request.query.page ? request.query.page.toString() : '0';
			this.bills.congress(congress, parseInt(page, 10) || 1).then(bills => {
				response.json(bills.map(b => new DefaultBillJson(b).value()));
			});
		});

		return router;
	}

	path(): Path {
		return this._path;
	}
}

export default BillExpressRouter;
