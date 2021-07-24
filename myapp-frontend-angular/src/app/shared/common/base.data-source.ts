import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Node, PageIn, PageInfo } from 'src/generated/graphql';

export abstract class BaseDataSource<T> implements DataSource<any> {
    dataSubject = new BehaviorSubject<any>([]);
    totalCountSubject = new BehaviorSubject<number>(0);
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    querySubscription!: Subscription;

    constructor(
        public pageIn?: PageIn,
        public pageInfo?: PageInfo,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<any> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(): void {
        this.loadingSubject.next(true);
        this.querySubscription = this.filter().
            pipe(
                finalize(() => {
                    this.loadingSubject.next(false);
                })
            ).
            subscribe((res: ApolloQueryResult<T>) => {
                this.loadingSubject.next(false);
                this.setResult(res);
            });
    }

    abstract filter(): Observable<ApolloQueryResult<T>>;
    abstract setResult(res: ApolloQueryResult<T>): void;
}
