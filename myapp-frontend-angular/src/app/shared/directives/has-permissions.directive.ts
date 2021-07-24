import {
  Directive,
  Input,
  OnInit, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { BaseShowHideDirective } from './base-show-hide.directive';


@Directive({
  selector: '[appHasPermissions]'
})
export class HasPermissionsDirective extends BaseShowHideDirective implements OnInit {
  private permissions: string[] = [];

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    private permissionService: PermissionService,
  ) {
    super(templateRef, viewContainer);
  }

  ngOnInit(): void {
    this.permissionService.permissionMap$.subscribe(permissionMap => {
      this.showView(this.checkPermission(permissionMap));
    });
  }

  @Input()
  set appHasPermissions(permissions: string[]) {
    this.permissions = permissions;
  }

  private checkPermission(permissionMap: Map<string, boolean> | null): boolean {
    if (!permissionMap) {
      return false;
    }

    for (const permissionToCheck of this.permissions) {
      const hasPermission = permissionMap.has(permissionToCheck);

      if (!hasPermission) {
        return false;
      }
    }

    return true;
  }
}