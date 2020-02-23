import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserInfo } from '../models/userInfo.modules';


@Injectable({
  providedIn: 'root'
})
export class SeabattleService {
  private server = 'http://localhost:3000/api/seabattle/';
  userInfoData: UserInfo;
  updatedUserInfoData = new Subject<UserInfo>();
  hashedShotCells = {};

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
        this.updateListener(response);
      });
  }

  updateUserInfo(x, y, result) {
    this.http.put<{msg: string, data: UserInfo}>(this.server, {
      msg: `User shot x:${x}, y: ${y}. Result: ${result}`,
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
    return this.hashedShotCells;
  }

  getShotCells() {
    return this.userInfoData.shotCells;
  }
  getShips() {
    return this.userInfoData.ships;
  }

  updateListener(response) {
    this.userInfoData = response.data[0];
    this.updatedUserInfoData.next(this.userInfoData);

    for (const cell of this.userInfoData.shotCells) {
      if (!this.hashedShotCells[cell.y + '-' + cell.x]) {
        this.hashedShotCells[cell.y + '-' + cell.x] = cell;
      }
    }
  }
}
