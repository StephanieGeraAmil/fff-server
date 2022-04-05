import express from 'express';
import {clearUpDB} from '../controllers/general.js'
const routerGeneral = express.Router();
routerGeneral.delete('/',clearUpDB);
export default routerGeneral;
