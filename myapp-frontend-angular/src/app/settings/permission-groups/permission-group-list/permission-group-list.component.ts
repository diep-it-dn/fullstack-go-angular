import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseListComponent } from 'src/app/shared/components/base-list/abstract-base-list.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DeletePermissionGroupGQL, OrderDirection, PermissionGroupAllQuery, PermissionGroupOrderField } from 'src/generated/graphql';
import { PermissionGroupDataSource } from './permission-group.data-source';

@Component({
  selector: 'app-permission-group-list',
  templateUrl: './permission-group-list.component.html',
  styleUrls: ['./permission-group-list.component.scss']
})
export class PermissionGroupListComponent extends AbstractBaseListComponent<PermissionGroupAllQuery> {
  displayedColumns = ['name', 'description', 'actions'];

  @Input() dataSource!: PermissionGroupDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('name') input!: ElementRef;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    private deletePermissionGroupGQL: DeletePermissionGroupGQL,
  ) {
    super(activatedRoute, router, dialog, notificationService);
  }

  override setParams(p: Params): void {
    super.setParams(p);
    if (p.name) {
      this.input.nativeElement.value = p.name;
      this.dataSource.input.name = p.name;
    } else {
      this.dataSource.input.name = null;
    }

    if (p.s) {
      const s = p.s.split(',');
      const field = PermissionGroupOrderField[s[0] as keyof typeof PermissionGroupOrderField];
      if (field) {
        const direction = s[1] === "asc" ? OrderDirection.Asc : OrderDirection.Desc
        this.sort.active = s[0];
        this.sort.direction = direction.toLowerCase() as SortDirection;

        this.dataSource.input.orderBy = {
          field: field,
          direction: direction
        }
      }
    }
  }

  delete(id: string): Observable<boolean> {
    return this.deletePermissionGroupGQL.mutate({ id }).pipe(map(res => res.data!.deletePermissionGroup));
  }

}
