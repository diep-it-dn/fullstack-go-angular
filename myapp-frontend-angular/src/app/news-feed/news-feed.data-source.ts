import { ApolloQueryResult } from "@apollo/client/core";
import { Observable } from 'rxjs';
import { BaseDataSource } from "src/app/shared/common/base.data-source";
import { PageIn, PageInfo, PostsIn, PublishedPostsGQL, PublishedPostsQuery } from "src/generated/graphql";

export class NewsFeedDataSource extends BaseDataSource<PublishedPostsQuery> {

    constructor(
        public input: PostsIn,
        private publishedPostsGQL: PublishedPostsGQL,
        public pageIn?: PageIn,
        public pageInfo?: PageInfo,
    ) {
        super(pageIn, pageInfo);
    }

    filter(): Observable<ApolloQueryResult<PublishedPostsQuery>> {
        this.input.pageIn = this.pageIn;
        return this.publishedPostsGQL.watch({ input: this.input }, { fetchPolicy: 'no-cache' }).valueChanges;
    }
    setResult(res: ApolloQueryResult<PublishedPostsQuery>): void {
        this.pageInfo = res.data.publishedPosts!.pageInfo;
        this.dataSubject.next(res.data.publishedPosts!.edges);
        this.totalCountSubject.next(res.data.publishedPosts!.totalCount);
    }

}