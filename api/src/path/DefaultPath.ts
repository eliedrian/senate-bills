import Path from './Path';

class DefaultPath implements Path {
	private path: string;

	constructor(path: string) {
		this.path = path;
	}

	value(): string {
		return this.path;
	}
}

export default DefaultPath;
