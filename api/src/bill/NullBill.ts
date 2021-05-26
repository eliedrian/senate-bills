import Bill from './Bill';

class NullBill implements Bill {
	constructor() {
	}

	id(): number {
		return -1;
	}

	congress(): number {
		return -1;
	}

	number(): number {
		return -1;
	}

	dateFiled(): Date {
		return new Date(0);
	}

	longTitle(): string {
		return "";
	}

	shortTitle(): string {
		return "";
	}

	status(): string {
		return "";
	}

	scope(): string {
		return "";
	}

	url(): string {
		return "";
	}

	voteType(): string {
		return "";
	}

	presidentAction(): string {
		return "";
	}

	presidentReceived(): Date {
		return new Date(0);
	}

	presidentSigned(): Date {
		return new Date(0);
	}

	republicAct(): string {
		return "";
	}
}

export default NullBill;
