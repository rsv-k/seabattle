import { Cell } from './cell.modules';

export interface UserInfo {
  _id: string;
  ships: Cell[][];
  shotCells: Cell[];
  history: string[];
}
