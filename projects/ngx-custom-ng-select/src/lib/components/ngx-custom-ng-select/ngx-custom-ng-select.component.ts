import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {catchError, debounceTime, defer, EMPTY, finalize, fromEvent, map, Observable, of, Subscription, switchMap, tap, throwError} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import * as objectPath from 'object-path';

@Component({
  selector: 'lib-ngx-custom-ng-select',
  templateUrl: './ngx-custom-ng-select.component.html',
  styleUrls: ['./ngx-custom-ng-select.component.css']
})
export class NgxCustomNgSelectComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('term', {static: true, read: NgSelectComponent}) public inputSelect: NgSelectComponent;

  @Input() notFound = 'No results';
  @Input() name = 'default-custom-select';
  @Input() items: any[] = [];
  @Input() selectedItem: any;
  @Input() bindValue: string;
  @Input() bindLabel: string;
  @Input() selectId: string;
  @Input() loadingText = 'Loading...';

  @Input() virtualScroll = true;
  @Input() bufferDim = 1;
  @Input() multiple = false;
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() clearable = true;
  @Input() errorStyle = false;
  @Input() customClass: Array<string> | string;
  @Input() addTag = false;
  @Input() addTagText: string;
  @Input() returnFullObjectOnChanged = false;
  @Input() isStaticItem = false;

  @Input() headerTemplate: TemplateRef<any>;


  @Input() initLoadItems: () => Observable<any>;
  @Input() searchingCallback: () => Observable<any>;
  @Input() scrollToEndCallback: () => Observable<any>;
  @Input() searchExistingItemCallback: () => Observable<any>;

  @Output() resetEvent = new EventEmitter<boolean>();
  @Output() loadItemsEvent = new EventEmitter<any>();
  @Output() scrollToEndEvent = new EventEmitter<any>();
  @Output() searchingEvent = new EventEmitter<any>();
  @Output() searchingParamsEvent = new EventEmitter<any>();
  @Output() searchExistingItemEvent = new EventEmitter<any>();
  @Output() selectedItemChangeEvent = new EventEmitter<any>();

  @Output() focusEvent = new EventEmitter<boolean>();
  @Output() openEvent = new EventEmitter<boolean>();
  @Output() closeEvent = new EventEmitter<boolean>();

  public loading = false;

  private subscriptions: Array<Subscription> = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (!this.isStaticItem) {
      this.loadItems();
      this.search();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.notFound = changes?.notFoundTranslated?.currentValue ?? this.notFound;
    this.name = changes?.name?.currentValue ?? this.name;
    this.items = changes?.items?.currentValue ?? this.items;
    this.selectedItem = changes?.selectedItem ? changes?.selectedItem?.currentValue : this.selectedItem;
    this.bindValue = changes?.bindValue?.currentValue ?? this.bindValue;
    this.bindLabel = changes?.bindLabel?.currentValue ?? this.bindLabel;
    this.selectId = changes?.selectId?.currentValue ?? this.selectId;
    this.loadingText = changes?.loadingText?.currentValue ?? this.loadingText;
    this.virtualScroll = changes?.virtualScroll?.currentValue ?? this.virtualScroll;
    this.multiple = changes?.multiple?.currentValue ?? this.multiple;
    this.placeholder = changes?.placeholderTranslated?.currentValue ?? this.placeholder;
    this.disabled = changes?.disabled?.currentValue ?? this.disabled;
    this.clearable = changes?.clearable?.currentValue ?? this.clearable;
    this.errorStyle = changes?.errorStyle?.currentValue ?? this.errorStyle;
    this.customClass = changes?.customClass?.currentValue ?? this.customClass;
    this.addTag = changes?.addTag?.currentValue ?? this.addTag;
    this.addTagText = changes?.addTagText?.currentValue ?? this.addTagText;
    this.returnFullObjectOnChanged = changes?.returnFullObjectOnChanged?.currentValue ?? this.returnFullObjectOnChanged;
    this.headerTemplate = changes?.headerTemplate?.currentValue ?? this.headerTemplate;
    this.isStaticItem = changes?.isStaticItem?.currentValue ?? this.isStaticItem;
    this.initLoadItems = changes?.initLoadItems?.currentValue ?? this.initLoadItems;
    this.searchingCallback = changes?.searchingCallback?.currentValue ?? this.searchingCallback;
    this.scrollToEndCallback = changes?.scrollToEndCallback?.currentValue ?? this.scrollToEndCallback;
    this.searchExistingItemCallback = changes?.searchExistingItemCallback?.currentValue ?? this.searchExistingItemCallback;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public selectedItemChange(event: any) {
    this.selectedItem = this.multiple ? event?.map((el: any) => el?.[this.bindValue]) : event?.[this.bindValue];
    this.selectedItemChangeEvent.emit(this.returnFullObjectOnChanged ? event : this.selectedItem);
  }

  public loadItems(): void {
    if (this.initLoadItems) {
      this.loading = true;
      const sb = this.initLoadItems().pipe(
        tap((data: HttpResponse<any>) => {
          this.loading = false;
          this.loadItemsEvent.emit(data);
        }),
        switchMap(() => this.getExistingItem()),
        catchError(error => {
          this.loading = false;
          return throwError(error);
        }),
      ).subscribe();
      this.subscriptions.push(sb);
    }
  }

  public scrollToEnd() {
    if (this.scrollToEndCallback) {
      this.loading = true;
      const sb = this.scrollToEndCallback().pipe(
        tap((data: HttpResponse<any>) => {
          this.loading = false;
          this.scrollToEndEvent?.emit(data);
        }),
        catchError((err) => {
          this.loading = false;
          console.error(err);
          return of(null);
        })
      ).subscribe();
      this.subscriptions.push(sb);
    }
  }

  public resetList() {
    this.resetEvent.emit(true);
  }

  public getLabel(item: any): string {
    return item && objectPath.get(item, this.bindLabel);
  }

  public search(): void {
    const sb = fromEvent(this.inputSelect.element, 'keyup').pipe(
      map((event: any) => {
        this.searchingParamsEvent.emit(event.target.value);
        return event.target.value;
      }),
      debounceTime(500),
    ).subscribe(text => {
        if (!this.searchingCallback) {
          return;
        }
        if (text?.length > 1) {
          this.loading = true;
          this.cdr.detectChanges();
          this.callSearchingAPI().subscribe();
        } else {
          this.loadItems();
        }
      }
    );
    this.subscriptions.push(sb);
  }

  public callSearchingAPI() {
    return this.searchingCallback().pipe(
      switchMap((response) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.searchingEvent.emit(response);
        return this.getExistingItem();
      }),
      catchError((error) => {
        this.loading = false;
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  // Ng-select functions

  public onFocus() {
    this.focusEvent.emit(true);
  }

  public onOpen() {
    this.openEvent.emit(true);
  }

  public onClose() {
    this.closeEvent.emit(true);
  }

  // Private Methods
  private getExistingItem(): Observable<any> {
    return defer(() => {
      if (this.canSearchItem()) {
        this.loading = true;
        return this.searchExistingItemCallback().pipe(
          tap((data: any) => {
            if (data) {
              this.searchExistingItemEvent?.emit(data);
              this.cdr.detectChanges();
            }
          }),
          catchError(err => {
            console.error(err);
            return of({});
          }),
          finalize(() => this.loading = false));
      } else {
        return EMPTY;
      }
    });
  }

  private canSearchItem(): boolean {
    const isElementsAlreadyPresent =  (this.selectedItem instanceof Array) ? this.selectedItem.every(el => this.items.includes(el)) : this.items.includes(this.selectedItem);
    return (this.selectedItem &&
      !!this.searchExistingItemCallback &&
      this.searchExistingItemEvent &&
      !isElementsAlreadyPresent);
  }
}
