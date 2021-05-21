interface Method {
	value(): string;
}

export class GetMethod implements Method {
	value(): string {
		return 'GET';
	}
}

export class PostMethod implements Method {
	value(): string {
		return 'POST';
	}
}

export default Method;
