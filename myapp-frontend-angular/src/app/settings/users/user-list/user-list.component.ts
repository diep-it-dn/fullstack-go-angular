import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseListComponent } from 'src/app/shared/components/base-list/abstract-base-list.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DeleteUserGQL, OrderDirection, UserOrderField, UsersQuery } from 'src/generated/graphql';
import { UserDataSource } from './user.data-source';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends AbstractBaseListComponent<UsersQuery> implements AfterViewInit {
  displayedColumns = ['email', 'displayedName', 'firstName', 'lastName', 'birthday', 'gender', 'status', 'actions'];

  @Input() dataSource!: UserDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('email') input!: ElementRef;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    private deleteUserGQL: DeleteUserGQL,
  ) {
    super(activatedRoute, router, dialog, notificationService);
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.value = this.dataSource.input.email;

    super.ngAfterViewInit();
  }

  override setParams(p: Params): void {
    super.setParams(p);
    if (p.email) {
      this.dataSource.input.email = p.email;
    } else {
      this.dataSource.input.email = null;
    }
    if (p.s) {
      const s = p.s.split(',');
      const field = UserOrderField[s[0] as keyof typeof UserOrderField];
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
    return this.deleteUserGQL.mutate({ id }).pipe(map(res => res.data!.deleteUser));
  }
}
