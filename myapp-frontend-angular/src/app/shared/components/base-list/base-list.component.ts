import { Component, Input } from '@angular/core';
import { BaseDataSource } from '../../common/base.data-source';

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent<T> {

  @Input()
  dataSource!: BaseDataSource<T>;

  constructor() { }

}
