import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CommonService {
  profilePic = new BehaviorSubject('');
  pic = localStorage.getItem('profilePic');
  namei = localStorage.getItem('profileName');
  name = new BehaviorSubject('');
  count = new BehaviorSubject('');
  Notify_count = this.count.asObservable();
  constructor() {
    this.updateIdentity(this.pic, this.namei);
  }
  updateIdentity(pic: any, name: any) {
    this.profilePic.next(pic);
    this.name.next(name);
    // also set the identity in localStorage;
  }
  notification_count(count: any) {
    this.count.next(count);
  }
}
