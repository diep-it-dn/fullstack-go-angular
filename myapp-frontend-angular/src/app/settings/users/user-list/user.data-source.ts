import { ApolloQueryResult } from "@apollo/client/core";
import { Observable } from 'rxjs';
import { BaseDataSource } from "src/app/shared/common/base.data-source";
import { PageIn, PageInfo, UsersGQL, UsersIn, UsersQuery } from "src/generated/graphql";

export class UserDataSource extends BaseDataSource<UsersQuery> {

    constructor(
        public input: UsersIn,
        private usersGQL: UsersGQL,
        public pageIn?: PageIn,
        public pageInfo?: PageInfo,
    ) {
        super(pageIn, pageInfo);
    }

    filter(): Observable<ApolloQueryResult<UsersQuery>> {
        this.input.pageIn = this.pageIn;
        return this.usersGQL.watch({ input: this.input }, { fetchPolicy: 'no-cache' }).valueChanges;
    }
    setResult(res: ApolloQueryResult<UsersQuery>): void {
        this.pageInfo = res.data!.users!.pageInfo;
        this.dataSubject.next(res.data!.users!.edges);
        this.totalCountSubject.next(res.data!.users!.totalCount);
    }

}