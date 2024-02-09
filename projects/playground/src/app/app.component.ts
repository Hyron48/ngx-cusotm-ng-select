import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public page = 0;
  public per_page = 10;
  public totalPages = 200 / this.per_page;

  public searchParams: string;

  public isMultiple = false;

  public exampleArray: Array<any> = [];
  public selectedItem: number | Array<number> = 24;

  public isInError = false;

  public initArrayValues: () => Observable<Array<any>>;
  public searchSpecificCallback: () => Observable<Array<any>>;
  public scrollToEndArrayCallback: () => Observable<Array<any>>;
  public searchingCallback: () => Observable<Array<any>>;

  private sub: Subscription;

  constructor(private cdr: ChangeDetectorRef,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.initArrayValues = this.getInitValues.bind(this);
    this.searchSpecificCallback = this.getInitValues.bind(this);
    this.scrollToEndArrayCallback = this.simulateScrollToEndCallback.bind(this);
    this.searchingCallback = this.searchingCallbackValues.bind(this);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public getInitValues() {
    return this.http.get<Array<any>>('assets/user-list.json');
  }

  public simulateScrollToEndCallback() {
    console.log('pages > ', this.page, this.totalPages);
    if (this.page < this.totalPages) {
      this.page++;
      return this.http.get<Array<any>>('assets/user-list.json');
    }
    return of([]);
  }

  public searchingCallbackValues() {
    return this.http.get<Array<any>>('assets/user-list.json');
  }

  public changeSearchingParams(event: any) {
    this.searchParams = event;
  }

  public overWriteInitArray(evt: Array<any>) {
    this.page = 0;
    const firstCurrentEl = this.page * this.per_page;
    const lastCurrentEl = firstCurrentEl + this.per_page;
    this.exampleArray = [...new Map(evt?.slice(firstCurrentEl, lastCurrentEl)?.map(item => [item['index'], item])).values()];
    this.cdr.detectChanges();
  }

  public overWriteSearchingArray(evt: Array<any>) {
    this.page = 0;
    const firstCurrentEl = this.page * this.per_page;
    const lastCurrentEl = firstCurrentEl + this.per_page;
    const selectedItems = (this.selectedItem instanceof Array) ? this.selectedItem.map(el => this.exampleArray.find(item => item?.index == el)) : [this.exampleArray.find(item => item?.index == this.selectedItem)];
    this.exampleArray = [...new Map(selectedItems?.concat(evt?.filter(el => el?.email.includes(this.searchParams))?.slice(firstCurrentEl, lastCurrentEl))?.map(item => [item['index'], item])).values()];
    this.cdr.detectChanges();
  }

  public concatArray(evt: Array<any>) {
    const firstCurrentEl = this.page * this.per_page;
    const lastCurrentEl = firstCurrentEl + this.per_page;

    if (this.searchParams) {
      this.exampleArray = [...new Map(this.exampleArray.concat(evt?.filter(el => el?.email.includes(this.searchParams))?.slice(firstCurrentEl, lastCurrentEl)).map(item => [item['index'], item])).values()];
    } else {
      this.exampleArray = [...new Map(this.exampleArray.concat(evt?.slice(firstCurrentEl, lastCurrentEl)).map(item => [item['index'], item])).values()];
    }
    this.cdr.detectChanges();
  }

  public setSpecificValue(evt: Array<any>) {
    this.exampleArray = [...new Map(this.exampleArray.concat(evt.filter(el => (this.selectedItem instanceof Array) ? this.selectedItem.includes(el?.index) : el?.index == this.selectedItem)).map(item => [item['index'], item])).values()];
    this.cdr.detectChanges();
  }

  public changeIsMultiple(val: boolean) {
    this.isMultiple = val;
    this.selectedItem = (this.isMultiple && this.selectedItem) ? [this.selectedItem] : (this.selectedItem as Array<any>)?.[0];
  }

  public changeSelectedItem(val: any) {
    this.selectedItem = val;
  }

  public changePerPage(val: any) {
    this.per_page = val;
    this.totalPages = 200 / this.per_page;
    this.searchingCallback().pipe(
      tap(res => this.overWriteInitArray(res))
    ).subscribe()
  }

  public executeValidation() {
    this.isInError = (this.selectedItem instanceof Array) ? this.selectedItem.length == 0 : !this.selectedItem;
  }

  public refreshValidation() {
    this.isInError = false;
  }
}
