import { ApolloQueryResult } from "@apollo/client/core";
import { Observable } from 'rxjs';
import { BaseDataSource } from "src/app/shared/common/base.data-source";
import { PageIn, PageInfo, PermissionGroupsGQL, PermissionGroupsIn, PermissionGroupsQuery } from "src/generated/graphql";

export class PermissionGroupDataSource extends BaseDataSource<PermissionGroupsQuery> {

    constructor(
        public input: PermissionGroupsIn,
        private permissionGroupsGQL: PermissionGroupsGQL,
        public pageIn?: PageIn,
        public pageInfo?: PageInfo,
    ) {
        super(pageIn, pageInfo);
    }

    filter(): Observable<ApolloQueryResult<PermissionGroupsQuery>> {
        this.input.pageIn = this.pageIn;
        return this.permissionGroupsGQL.watch({ input: this.input }, { fetchPolicy: 'no-cache' }).valueChanges;
    }
    setResult(res: ApolloQueryResult<PermissionGroupsQuery>): void {
        this.pageInfo = res.data.permissionGroups!.pageInfo;
        this.dataSubject.next(res.data.permissionGroups!.edges);
        this.totalCountSubject.next(res.data.permissionGroups!.totalCount);
    }

}