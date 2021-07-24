import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Post, PostByIdGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  loading = false;
  post!: Post;

  constructor(
    private route: ActivatedRoute,
    private postByIdGQL: PostByIdGQL,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((queryParams: Params) => {
      this.postByIdGQL.fetch({ id: queryParams.id }).
        pipe(
          finalize(() => {
            this.loading = false;
          })
        ).
        subscribe(
          res => {
            this.post = res.data.postById as Post;
            this.loading = false;
          });
    });
  }

}
