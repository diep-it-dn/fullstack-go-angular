import { Component, OnInit } from '@angular/core';
import { PermissionGroupsGQL, PermissionGroupsIn } from 'src/generated/graphql';
import { PermissionGroupDataSource } from './permission-group-list/permission-group.data-source';

@Component({
  selector: 'app-permission-groups',
  templateUrl: './permission-groups.component.html',
  styleUrls: ['./permission-groups.component.scss']
})
export class PermissionGroupsComponent implements OnInit {

  input: PermissionGroupsIn = {};
  dataSource!: PermissionGroupDataSource;
  constructor(
    private permissionGroupsGQL: PermissionGroupsGQL,
  ) { }

  ngOnInit(): void {
    this.dataSource = new PermissionGroupDataSource(this.input, this.permissionGroupsGQL);
  }

}
