import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { SharedModule } from '../shared/shared.module';
import { NewsFeedRoutingModule } from './news-feed-routing.module';
import { NewsFeedComponent } from './news-feed.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostInfoComponent } from './post-info/post-info.component';



@NgModule({
  declarations: [NewsFeedComponent, PostDetailsComponent, PostInfoComponent],
  imports: [
    CommonModule,
    NewsFeedRoutingModule,
    SharedModule,
    TimeagoModule,
  ],
  exports:[
    NewsFeedComponent
  ]
})
export class NewsFeedModule { }
