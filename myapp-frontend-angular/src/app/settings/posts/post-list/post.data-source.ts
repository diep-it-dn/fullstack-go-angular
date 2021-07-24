import { ApolloQueryResult } from "@apollo/client/core";
import { Observable } from 'rxjs';
import { BaseDataSource } from "src/app/shared/common/base.data-source";
import { PageIn, PageInfo, PostsGQL, PostsIn, PostsQuery } from "src/generated/graphql";

export class PostDataSource extends BaseDataSource<PostsQuery> {

    constructor(
        public input: PostsIn,
        private postsGQL: PostsGQL,
        public pageIn?: PageIn,
        public pageInfo?: PageInfo,
    ) {
        super(pageIn, pageInfo);
    }

    filter(): Observable<ApolloQueryResult<PostsQuery>> {
        this.input.pageIn = this.pageIn;
        return this.postsGQL.watch({ input: this.input }, { fetchPolicy: 'no-cache' }).valueChanges;
    }
    setResult(res: ApolloQueryResult<PostsQuery>): void {
        this.pageInfo = res.data.posts!.pageInfo;
        this.dataSubject.next(res.data.posts!.edges);
        this.totalCountSubject.next(res.data.posts!.totalCount);
    }

}