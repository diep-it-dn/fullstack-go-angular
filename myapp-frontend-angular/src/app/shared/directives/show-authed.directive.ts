import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BaseShowHideDirective } from './base-show-hide.directive';


@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective extends BaseShowHideDirective implements OnInit {
  isShow!: boolean;

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    private userService: AuthService,
  ) {
    super(templateRef, viewContainer);
  }


  ngOnInit(): void {
    this.userService.isAuthenticated$.subscribe(isAuthenticated => {
      const isShow = isAuthenticated && this.isShow || !isAuthenticated && !this.isShow;
      this.showView(isShow);
    });
  }

  @Input() set appShowAuthed(isShow: boolean) {
    this.isShow = isShow;
  }

}
