import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, TagsGQL, TagsIn, TagsQuery } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private tagsGQL: TagsGQL,
  ) { }

  filter(input: TagsIn): Observable<TagsQuery> {
    return this.tagsGQL.fetch({ input: input }).pipe(map(res => res.data!.tags!.edges as TagsQuery));
  }

  public requestAutocompleteTags = (pattern: string): Observable<Tag[]> => {
    const input: TagsIn = {
      pageIn: {
        first: 5
      },
      q: !!pattern ? pattern.trim() : null
    }
    return this.tagsGQL.fetch({ input: input }).
    pipe(map(res => res.data!.tags!.edges!.map(edge => edge!.node as Tag)));
  }
}
