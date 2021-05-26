import express from 'express';
import { Pool } from 'pg';

import BillCatalogueServer from './server/BillCatalogueServer';
import DefaultPort from './port/DefaultPort';
import BillExpressRouter from './router/BillExpressRouter';
import DefaultPath from './path/DefaultPath';
import PgBills from './bill/PgBills';

const pgBills = new PgBills(new Pool());
const billRouter = new BillExpressRouter(new DefaultPath('/'), pgBills);
new BillCatalogueServer(express(), new DefaultPort(3000), [billRouter]).start();
