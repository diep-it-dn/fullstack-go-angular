import { Component, Input } from '@angular/core';
import { Post, User } from 'src/generated/graphql';

@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.scss']
})
export class PostInfoComponent {

  @Input()
  post!: Post;

  constructor() { }

  getAuthorName(user: User): string {
    const fullName = (this.getString(user.firstName) + ' ' + this.getString(user.lastName)).trim();
    return fullName.length > 0 ? fullName : user.email;
  }

  private getString(input?: string | null): string {
    if (input) {
      return input;
    }
    return '';
  }
}
