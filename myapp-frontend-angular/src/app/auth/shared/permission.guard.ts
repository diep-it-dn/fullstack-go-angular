import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const allowedPermissions = route.data['anyPermissions'] as Array<string>;

    return this.permissionService.permissionMap$.pipe(take(1), map(permissionMap => {
      for (const allowedPermission of allowedPermissions) {
        if (permissionMap?.has(allowedPermission)) {
          return true;
        }
      }

      if (state.url.startsWith('/settings')) {
        this.router.navigate(['/settings/error/access-denied']);
      } else {
        this.router.navigate(['/error/access-denied']);
      }
      return false;
    }));
  }

}