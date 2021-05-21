import Bill from './Bill';

interface Bills {
	bill(congress: number, number: number): Promise<Bill>;
	page(page: number): Promise<Array<Bill>>;
	congress(congress: number, page: number): Promise<Array<Bill>>;
}

export default Bills;
