import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseListComponent } from 'src/app/shared/components/base-list/abstract-base-list.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DeletePostGQL, PostsQuery } from 'src/generated/graphql';
import { PostDataSource } from './post.data-source';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent extends AbstractBaseListComponent<PostsQuery> implements AfterViewInit {
  displayedColumns = ['title', 'content', 'status', 'actions'];

  @Input() dataSource!: PostDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('q') input!: ElementRef;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    private deletePostGQL: DeletePostGQL,
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

  delete(id: string): Observable<boolean> {
    return this.deletePostGQL.mutate({ id }).pipe(map(res => res.data!.deletePost));
  }
}
