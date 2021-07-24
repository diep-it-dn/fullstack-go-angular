import {
  Directive,
  Input,
  OnInit, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { BaseShowHideDirective } from './base-show-hide.directive';


@Directive({
  selector: '[appHasAnyPermissions]'
})
export class HasAnyPermissionsDirective extends BaseShowHideDirective implements OnInit {
  private anyPermissions: string[] = [];

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
  set appHasAnyPermissions(anyPermissions: string[]) {
    this.anyPermissions = anyPermissions;
  }

  private checkPermission(permissionMap: Map<string, boolean> | null): boolean {
    if (!permissionMap) {
      return false;
    }

    for (const permissionToCheck of this.anyPermissions) {
      const hasPermission = permissionMap.has(permissionToCheck);

      if (hasPermission) {
        return true;
      }
    }
    return false;
  }
}