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
      return this.startOver(true);
    }

    this.http.get<{msg: string, data: UserInfo}>(this.server + id)
      .subscribe((response) => {
        if (!response.data) {
          // if data in db disappeared
          localStorage.removeItem('id');
          return this.startOver(true);
        }
        this.updateListener(response);
      });

  }

  updateUserInfo() {
    this.http.put<{msg: string}>(this.server, {
      updatedUserInfo: this.userInfoData
    })
      .subscribe((response) => {
        this.updateListener(response);
      });
  }

  userInfoDataUpdateListener() {
    return this.updatedUserInfoData.asObservable();
  }

  startOver(isNewUser = false) {
    if (!this.userInfoData) {
      isNewUser = true;
    }
    this.http.delete<{msg: string, data: UserInfo}>(this.server + (isNewUser ? 1 : this.userInfoData._id))
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

  updateCell(x: number, y: number) {
    let result: any;
    let shotShipIndex: number;
    let shotCell: Cell;

    // find the shot cell
    const shotShip = this.userInfoData.ships.find((ship, index) => {
      return ship.some((cell) => {
        if (cell.x === x && cell.y === y) {
          shotShipIndex = index;
          this.userInfoData.shotCells.push(cell);
          cell.condition = 'wounded';
          shotCell = cell;

          result = 'wounded';
          return cell;
        }
      });
    });


    if (shotShip && shotShip.every(cell => cell.condition === 'wounded')) {
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
        condition: 'empty'
      });

      result = 'empty';
    }
    this.userInfoData.history.push(`User shot x:${x}, y: ${y}. Result: ` + result);


    if (this.isGameOver()) {
      this.userInfoData.history.push('All ships were destroyed');
    }

    this.updateUserInfo();
    return result;
  }

  isGameOver() {
    return this.userInfoData.ships.length === 0;
  }
}

