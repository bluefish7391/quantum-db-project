
import { DataDAO } from './data-dao';

const DATABASE_PATH: string = "../../db/database.sqlite";
export const dataDAO = new DataDAO(DATABASE_PATH);