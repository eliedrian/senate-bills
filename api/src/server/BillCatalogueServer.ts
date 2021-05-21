import { Express, Router } from 'express';

import Server from './Server';
import Port from '../port/Port';
import ExpressRouter from '../router/ExpressRouter';

class BillCatalogueServer implements Server {
	private express: Express;
	private port: Port;
	private routers: Array<ExpressRouter>;

	constructor(express: Express, port: Port, routers: Array<ExpressRouter>) {
		this.express = express;
		this.port = port;
		this.routers = routers;
	}

	start(): void {
		for (let router of this.routers) {
			this.express.use(router.path().value(), router.router());
		}

		this.express.listen(this.port.value(), () => {
			console.log('Listening on port', this.port.value());
		});
	}
}

export default BillCatalogueServer;
