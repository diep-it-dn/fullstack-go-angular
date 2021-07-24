import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/shared/permission.guard';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostUpdateComponent } from './post-update/post-update.component';
import { PostsComponent } from './posts.component';


const routes: Routes = [
  { path: '', component: PostsComponent },
  {
    path: 'new', component: PostCreateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['POST', 'POST_C'] }
  },
  {
    path: ':id', component: PostUpdateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['POST', 'POST_R', 'POST_U'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
