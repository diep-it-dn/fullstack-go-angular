import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { Post, PostByIdGQL, UpdatePostGQL, UpdatePostIn } from 'src/generated/graphql';
import { PostUpdate } from './post-update.model';

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.component.html',
  styleUrls: ['./post-update.component.scss']
})
export class PostUpdateComponent extends AbstractBaseFormComponent<PostUpdate, Post> implements OnInit {
  id!: string;

  constructor(
    private route: ActivatedRoute,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private postByIdGQL: PostByIdGQL,
    private updatePostGQL: UpdatePostGQL,
    public tagService: TagService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "Update Post";
    this.baseForm.type = FormType.UPDATE;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.params.subscribe((queryParams: Params) => {
      this.id = queryParams.id;

      this.postByIdGQL.fetch({ id: this.id }).subscribe(res => {
        this.form.patchValue(res.data.postById!);
      });
    });
  }

  newT(): PostUpdate {
    const postUpdate = new PostUpdate();
    return postUpdate;
  }

  submit(): Observable<Post> {
    const post: PostUpdate = this.baseForm.form.value;

    const tags: string[] = [];
    if (post.tags) {
      post.tags.forEach(tag => {
        tags.push(tag.name);
      });
    }

    const input: UpdatePostIn = {
      statusIn: {
        isUpdate: true,
        value: post.status
      },
      titleIn: {
        isUpdate: true,
        value: post.title
      },
      shortDescriptionIn: {
        isUpdate: true,
        value: post.shortDescription
      },
      contentIn: {
        isUpdate: true,
        value: post.content
      },
      tagsIn: {
        isUpdate: true,
        value: tags
      }
    }

    return this.updatePostGQL.mutate({ id: this.id, input }).pipe(map(res => {
      return res.data!.updatePost as Post;
    }));
  }

  afterSubmitOK(res: any): void {
  }
}
