import Port from './Port';

class DefaultPort implements Port {
	private port: number;

	constructor(port: number) {
		this.port = port;
	}

	value(): number {
		return this.port;
	}
}

export default DefaultPort;
