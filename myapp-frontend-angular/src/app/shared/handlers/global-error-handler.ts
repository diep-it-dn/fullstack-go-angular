
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { constants } from '../common/constants';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private notificationService: NotificationService,
        private router: Router,
        private ngZone: NgZone,
    ) { }

    handleError(error: Error | HttpErrorResponse): void {
        this.ngZone.run(() => {
            console.log(error);
            if (error.message === constants.TokenIsExpired) {
                this.router.navigate(['auth', 'login'], { queryParams: { returnUrl: this.router.url } });
            } else if (error.message === constants.AccessDenied.code) {
                this.notificationService.error(constants.AccessDenied.msg);
            }
        });
    }
}

