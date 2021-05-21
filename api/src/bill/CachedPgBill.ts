
import Bill from './Bill';
import BillSchema from './BillSchema';

class CachedPgBill implements Bill {
	private result: BillSchema;

	constructor(result: BillSchema) {
		this.result = result;
	}

	id(): number {
		return this.result.id;
	}

	congress(): number {
		return this.result.congress;
	}

	number(): number {
		return this.result.number;
	}

	dateFiled(): Date {
		return this.result.date_filed;
	}

	longTitle(): string {
		return this.result.long_title;
	}

	shortTitle(): string {
		return this.result.short_title;
	}

	status(): string {
		return this.result.status;
	}

	scope(): string {
		return this.result.scope;
	}

	url(): string {
		return this.result.url;
	}

	voteType(): string {
		return this.result.vote_type;
	}

	presidentAction(): string {
		return this.result.president_action;
	}

	presidentReceived(): Date {
		return this.result.president_received;
	}

	presidentSigned(): Date {
		return this.result.president_signed;
	}

	republicAct(): string {
		return this.result.republic_act;
	}
}

export default CachedPgBill;
