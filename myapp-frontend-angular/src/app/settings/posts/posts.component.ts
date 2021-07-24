import { Component, OnInit } from '@angular/core';
import { PostsGQL, PostsIn } from 'src/generated/graphql';
import { PostDataSource } from './post-list/post.data-source';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  input: PostsIn = {};
  dataSource!: PostDataSource;
  constructor(
    private postsGQL: PostsGQL,
  ) { }

  ngOnInit(): void {
    this.dataSource = new PostDataSource(this.input, this.postsGQL);
  }

}
