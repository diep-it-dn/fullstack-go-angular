import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseDataSource } from '../../common/base.data-source';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  template: ''
})
export abstract class AbstractBaseListComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  abstract get dataSource(): BaseDataSource<T>;
  abstract get paginator(): MatPaginator;
  abstract get sort(): MatSort | null;
  abstract get input(): ElementRef | ElementRef[] | null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(distinctUntilChanged()).subscribe(p => {
      this.setParams(p);
      this.loadPage();
    });


    this.dataSource.totalCountSubject.subscribe(totalCount => {
      this.paginator.length = totalCount;
    });
  }

  setParams(p: Params): void {
    if (!this.dataSource.pageIn) {
      this.dataSource.pageIn = {
        first: 5
      }
    }

    this.dataSource.pageIn = {}
    this.paginator.pageIndex = 0;

    // p.p is param for pageIndex
    if (p.p) {
      this.paginator.pageIndex = +p.p;
    }
    // p.l is param for pageSize
    if (p.l) {
      this.paginator.pageSize = +p.l;
      this.dataSource.pageIn.first = +p.l;
    } else {
      this.paginator.pageSize = 5;
      this.dataSource.pageIn.first = 5;
    }

    // p.a is param for page after a cursor
    if (p.a) {
      this.dataSource.pageIn.first = this.paginator.pageSize;
      this.dataSource.pageIn.last = null;
      this.dataSource.pageIn.after = p.a;
      this.dataSource.pageIn.before = null;
    }
    // p.a is param for page before a cursor
    if (p.b) {
      this.dataSource.pageIn.first = null;
      this.dataSource.pageIn.last = this.paginator.pageSize;
      this.dataSource.pageIn.after = null;
      this.dataSource.pageIn.before = p.b;
    }
  }

  ngOnDestroy(): void {
    this.dataSource.querySubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.sort?.sortChange.subscribe((value) => {
      this.paginator.pageIndex = 0;
      const previousPageSize = this.dataSource.pageIn!.first || this.dataSource.pageIn!.last;
      this.dataSource.pageIn = {
        first: previousPageSize,
      };

      const queryParams: {
        [key: string]: any;
      } = { p: 0, l: previousPageSize, s: value.active + ',' + value.direction };

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
    });

    if (this.input) {
      const inputs = [];
      if (this.input instanceof ElementRef) {
        inputs.push(this.input);
      } else {
        inputs.push(...this.input);
      }


      inputs.forEach(element => {
        fromEvent(element.nativeElement, 'keyup')
          .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
              this.paginator.pageIndex = 0;
              const searchByValue = element.nativeElement.attributes['searchBy'].value as string;
              const queryParams: {
                [key: string]: any;
              } = {};
              queryParams[searchByValue] = element.nativeElement.value;
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
              });
            })
          )
          .subscribe();
      });
    }

  }

  public getPaginatorData(event: PageEvent): PageEvent {
    const queryParams: any = { p: event.pageIndex };

    const previousPageSize = this.dataSource.pageIn!.first || this.dataSource.pageIn!.last;
    if (previousPageSize !== event.pageSize || event.pageIndex == 0) {
      this.paginator.pageIndex = 0;
      this.dataSource.pageIn = {
        first: event.pageSize,
      }
      queryParams.a = null;
      queryParams.b = null;
      queryParams.p = 0;
      queryParams.l = event.pageSize;

    } else if (event.previousPageIndex! < event.pageIndex) {
      this.dataSource.pageIn = {
        after: this.dataSource.pageInfo!.endCursor,
        first: event.pageSize,
      }
      queryParams.a = this.dataSource.pageInfo!.endCursor;
      queryParams.b = null;
      queryParams.l = event.pageSize;

    } else {
      this.dataSource.pageIn = {
        before: this.dataSource.pageInfo!.startCursor,
        last: event.pageSize,
      }
      queryParams.a = null;
      queryParams.b = this.dataSource.pageInfo!.startCursor;
      queryParams.l = event.pageSize;
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
    return event;
  }

  loadPage(): void {
    this.dataSource.loadData();
  }

  onEdit(id: string): void {
    this.router.navigate([this.router.url.split('?')[0], id]);
  }

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(id).subscribe(res => {
          if (res) {
            this.afterDeleted();
          }
        });
      }
    });
  }

  afterDeleted(): void {
    this.notificationService.deleteSuccess();
    this.loadPage();
  }

  delete(id: string): Observable<boolean> {
    throw new Error('not implemented');
  };
}
