import { Router } from 'express';
import Path from '../path/Path';

interface ExpressRouter {
	router(): Router;
	path(): Path;
}

export default ExpressRouter;
