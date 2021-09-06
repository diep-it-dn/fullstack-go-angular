import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractBaseListComponent } from 'src/app/shared/components/base-list/abstract-base-list.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PostsQuery, User } from 'src/generated/graphql';
import { AuthService } from '../shared/services/auth.service';
import { NewsFeedDataSource } from './news-feed.data-source';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent extends AbstractBaseListComponent<PostsQuery> implements AfterViewInit {
  displayedColumns = ['title', 'content', 'status', 'actions'];

  @Input() dataSource!: NewsFeedDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild("q") input!: ElementRef;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    public authService: AuthService,
  ) {
    super(activatedRoute, router, dialog, notificationService);
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.value = this.dataSource.input.q;

    super.ngAfterViewInit();
  }

  setParams(p: Params): void {
    super.setParams(p);
    if (p.q) {
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
