import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserInfo } from '../models/userInfo.modules';
import { Cell } from '../models/cell.modules';


@Injectable({
  providedIn: 'root'
})
export class SeabattleService {
  private server = 'http://localhost:3000/api/seabattle/';
  userInfoData: UserInfo;
  updatedUserInfoData = new Subject<UserInfo>();

  constructor(private http: HttpClient) { }

  getUserInfo() {
    const id = localStorage.getItem('id');

    // if id doesn't exit (aka user doesn't exist)
    // create a new one
    if (!id) {
      return this.startOver();
    }

    this.http.get<{msg: string, data: UserInfo}>(this.server + id)
      .subscribe((response) => {
        if (!response) {
          // if data in db disappeared
          localStorage.removeItem('id');
          return this.startOver();
        }
        this.updateListener(response);
      });
  }

  updateUserInfo(message) {
    this.http.put<{msg: string, data: UserInfo}>(this.server, {
      msg: message,
      updatedUserInfo: this.userInfoData
    })
      .subscribe((response) => {

        this.updateListener(response);
    });
  }

  userInfoDataUpdateListener() {
    return this.updatedUserInfoData.asObservable();
  }

  startOver() {
    this.http.delete<{msg: string, data: UserInfo}>(this.server)
      .subscribe((response) => {
        this.updateListener(response);

        // if new user was created, save his id in localstorage 
        // in order to later fetch his game and not anyone's else
        localStorage.setItem('id', this.userInfoData._id);
      });
  }

  getShotCellsHashed() {
    const hash = {};
    for (const cell of this.userInfoData.shotCells) {
      hash[cell.y + '-' + cell.x] = cell;
    }

    return hash;
  }

  updateListener(response) {
    this.userInfoData = response.data;
    this.updatedUserInfoData.next(this.userInfoData);
  }

  updateCell(x, y) {
    let message =  `User shot x:${x}, y: ${y}. Result: `;
    let result: any;
    let shotShipIndex: number;
    let shotCell: Cell;

    const shotShip = this.userInfoData.ships.find((ship, index) => {
      return ship.some((cell) => {
        if (cell.x === x && cell.y === y) {
          shotShipIndex = index;
          this.userInfoData.shotCells.push(cell);
          cell.condition = 'shot';
          shotCell = cell;

          result = 'shot';
          return cell;
        }
      });
    });

    if (shotShip && shotShip.every(cell => cell.condition === 'shot')) {
      const hashedShotCells = this.getShotCellsHashed();
      for (const cell of shotShip) {
        hashedShotCells[cell.y + '-' + cell.x].condition = 'destroyed';
      }
      // delete ship
      this.userInfoData.ships.splice(shotShipIndex, 1);
      result = 'destroyed';
    } else if (!shotShip) {
      this.userInfoData.shotCells.push({
        y,
        x,
        value: 0,
        condition: 'shot'
      });

      result = 'miss';
    }

    // check if all ships were destroyed
    if (!this.userInfoData.ships.length) {
      message = 'All ships were destroyed';
      result = '';
    }

    this.updateUserInfo(message + result);
    return shotCell;
  }
}
