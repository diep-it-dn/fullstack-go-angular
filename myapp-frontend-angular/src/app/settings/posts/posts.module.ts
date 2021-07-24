import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostUpdateComponent } from './post-update/post-update.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';



@NgModule({
  declarations: [PostsComponent, PostListComponent, PostCreateComponent, PostUpdateComponent,],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule,
  ]
})
export class PostsModule { }
