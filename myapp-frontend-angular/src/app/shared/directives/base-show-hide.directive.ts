import { TemplateRef, ViewContainerRef } from "@angular/core";

export class BaseShowHideDirective {
    private isHidden = true;
    constructor(
        protected templateRef: TemplateRef<any>,
        protected viewContainer: ViewContainerRef,
    ) { }

    showView(isShow: boolean): void {
        if (isShow) {
            if (this.isHidden) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.isHidden = false;
            }
        } else {
            this.hideView();
        }
    }

    private hideView(): void {
        this.isHidden = true;
        this.viewContainer.clear();
    }

}