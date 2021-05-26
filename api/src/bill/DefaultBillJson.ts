import Bill from './Bill';
import BillJson from './BillJson';

class DefaultBillJson {
	private bill: Bill;

	constructor(bill: Bill) {
		this.bill = bill;
	}

	value(): BillJson {
		return {
			id: this.bill.id(),
			congress: this.bill.congress(),
			number: this.bill.number(),
			dateFiled: this.bill.dateFiled(),
			longTitle: this.bill.longTitle(),
			shortTitle: this.bill.shortTitle(),
			status: this.bill.status(),
			scope: this.bill.scope(),
			url: this.bill.url(),
			voteType: this.bill.voteType(),
			presidentAction: this.bill.presidentAction(),
			presidentReceived: this.bill.presidentReceived(),
			presidentSigned: this.bill.presidentSigned(),
			republicAct: this.bill.republicAct()
		};
	}
}

export default DefaultBillJson;
