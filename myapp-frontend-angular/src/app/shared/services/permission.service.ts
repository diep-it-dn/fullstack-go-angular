import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  permissionMap$: Observable<Map<string, boolean> | null>;
  private permissionMapSubject = new ReplaySubject<Map<string, boolean> | null>(1);

  constructor(
    private authService: AuthService,
  ) {
    this.permissionMap$ = this.permissionMapSubject.asObservable();
    this.authService.currentUser$.subscribe(currentUser => {
      this.permissionMapSubject.next();
      const permissionMap = new Map<string, boolean>();
      if (!currentUser || !currentUser.permissionGroups) {
        return;
      }

      for (let i = 0; i < currentUser.permissionGroups.length; i++) {
        const permissionGroup = currentUser.permissionGroups[i];
        for (let j = 0; j < permissionGroup.permissions.length; j++) {
          const permission = permissionGroup.permissions[j];

          permissionMap.set(permission, true);
        }
      }

      this.permissionMapSubject.next(permissionMap);
    });
  }



}
