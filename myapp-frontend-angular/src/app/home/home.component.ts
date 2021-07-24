import { Component, OnInit } from '@angular/core';
import { PostsIn, PublishedPostsGQL } from 'src/generated/graphql';
import { NewsFeedDataSource } from '../news-feed/news-feed.data-source';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  input: PostsIn = {};
  dataSource!: NewsFeedDataSource;
  constructor(
    private publishedPostsGQL: PublishedPostsGQL,
  ) { }

  ngOnInit(): void {
    this.dataSource = new NewsFeedDataSource(this.input, this.publishedPostsGQL);
  }

}
