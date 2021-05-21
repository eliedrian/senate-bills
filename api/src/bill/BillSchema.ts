interface BillSchema {
	id: number;
	congress: number;
	number: number;
	date_filed: Date;
	long_title: string;
	short_title: string;
	status: string;
	scope: string;
	url: string;
	vote_type: string;
	president_action: string;
	president_received: Date;
	president_signed: Date;
	republic_act: string;
}

export default BillSchema;
