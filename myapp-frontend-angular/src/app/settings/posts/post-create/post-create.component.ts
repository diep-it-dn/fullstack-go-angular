import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { CreatePostGQL, Post, Tag } from 'src/generated/graphql';
import { PostCreate } from './post-create.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent extends AbstractBaseFormComponent<PostCreate, Post> implements OnInit {

  constructor(
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private createPostGQL: CreatePostGQL,
    public tagService: TagService,
    private router: Router,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "New Post";
    this.baseForm.type = FormType.CREATE;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newT(): PostCreate {
    const postCreate = new PostCreate();
    return postCreate;
  }


  submit(): Observable<Post> {
    const input = Object.assign({}, this.form.value);
    const tags: string[] = [];
    if (input.tags) {
      input.tags.forEach((tag: Tag) => {
        tags.push(tag.name);
      });
      input.tags = tags;
    }

    return this.createPostGQL.mutate({ input: input }).pipe(map(res => {
      return res.data!.createPost as Post;
    }));
  }

  afterSubmitOK(res: Post): void {
    this.router.navigate([this.router.url.substr(0, this.router.url.lastIndexOf('/new')), res.id]);
  }
}
