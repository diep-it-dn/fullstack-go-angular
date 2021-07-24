import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseListComponent } from 'src/app/shared/components/base-list/abstract-base-list.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DeletePostGQL, PostsIn, PostsQuery, User } from 'src/generated/graphql';
import { AuthService } from '../shared/services/auth.service';
import { NewsFeedDataSource } from './news-feed.data-source';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent extends AbstractBaseListComponent<PostsQuery> implements OnInit {

  filter: PostsIn = {};
  @ViewChild("q", { static: true })
  filterStringInput!: ElementRef;
  @Input()
  dataSource!: NewsFeedDataSource;
  displayedColumns = ['title', 'content', 'status', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;


  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    private deletePostGQL: DeletePostGQL,
    public authService: AuthService,
  ) {
    super(activatedRoute, router, dialog, notificationService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  get input(): ElementRef[] {
    const rs = [];
    rs.push(this.filterStringInput);
    return rs;
  }

  setParams(p: Params): void {
    super.setParams(p);
    if (p.q) {
      this.filterStringInput.nativeElement.value = p.q;
      this.dataSource.input.q = p.q;
    } else {
      this.dataSource.input.q = null;
    }

    if (p.tag) {
      this.dataSource.input.tag = p.tag;
    } else {
      this.dataSource.input.tag = null;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.input.q = filterValue.trim().toLowerCase();

    this.loadPage();
  }

  delete(id: string): Observable<boolean> {
    return this.deletePostGQL.mutate({ id }).pipe(map(res => res.data!.deletePost));
  }

  getAuthorName(user: User): string {
    const fullName = (this.getString(user.firstName) + ' ' + this.getString(user.lastName)).trim();
    return fullName.length > 0 ? fullName : user.email;
  }

  private getString(input?: string | null): string {
    if (input) {
      return input;
    }
    return '';
  }
}
