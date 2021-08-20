import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { CommonService } from '../common/common.service';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../notifications/notifications.service';
import { ProfileService } from '../../app/profile/profile.service';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  notifyBadge: string;
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver,
    private CommonService: CommonService,
    private spinner: NgxSpinnerService,
    private NotificationService: NotificationService,
    private ProfileService: ProfileService
  ) {}

  sideBarOpen: boolean = true;
  public innerWidth: any;
  profilePic: any;
  profileName: any;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = true;
  isShowing1 = false;
  showNotification: boolean = false;
  ngOnInit() {
    this.spinner.show();
    this.authenticationService.GetNotificationCount().subscribe((response) => {
      this.spinner.hide();
      if (response['status'] == 'ok') {
        this.CommonService.notification_count(response['data']);
      }
    });
    this.authenticationService.GetProfile().subscribe((response) => {
      if (response['status'] == 'ok') {
        this.profilePic = response['data'].photo;
      }
    });
    this.CommonService.Notify_count.subscribe((count) => (this.notifyBadge = count));
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 767) {
      this.sideBarOpen = false;
    }
    //this.profilePic = localStorage.getItem('profilePic');
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
    });
  }

  showSubSubMenu1() {
    if (!this.isShowing1) {
      this.isShowing1 = true;
    } else {
      this.isShowing1 = false;
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  notify() {
    this.showNotification = !this.showNotification;
  }
  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  logout() {
    this.authenticationService.logout();
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.access : null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
  product() {
    this.router.navigate(['product']);
  }
  profile() {
    this.showNotification = !this.showNotification;
    this.router.navigate(['profile']);
  }
  setting() {
    this.router.navigate(['profile']);
  }
}
