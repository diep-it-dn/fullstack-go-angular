import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error.component';
import { NoPermissionComponent } from './no-permission/no-permission.component';


const routes: Routes = [
  { path: '', component: ErrorComponent },
  { path: 'access-denied', component: NoPermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
