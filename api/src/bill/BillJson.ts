interface BillJson {
	id: number;
	congress: number;
	number: number;
	dateFiled: Date;
	longTitle: string;
	shortTitle: string;
	status: string;
	scope: string;
	url: string;
	voteType: string;
	presidentAction: string;
	presidentReceived: Date;
	presidentSigned: Date;
	republicAct: string;
}

export default BillJson;
