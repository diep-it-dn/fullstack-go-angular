import { Component, OnInit } from '@angular/core';
import { UsersGQL, UsersIn } from 'src/generated/graphql';
import { UserDataSource } from './user-list/user.data-source';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  input: UsersIn = {};
  dataSource!: UserDataSource;
  constructor(
    private usersGQL: UsersGQL,
  ) { }

  ngOnInit(): void {
    this.dataSource = new UserDataSource(this.input, this.usersGQL);
  }

}
