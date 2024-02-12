# NgxCustomNgSelect

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

This is an extended version of the classic ng-select. It allows you to define callbacks for data loading, such as pagination, quickly and easily. It also allows you to integrate search with API calls.

## Installation

`npm install ngx-custom-ng-select`

## Usage

- .ts

```ts
export class AppComponent {

  public initArrayValues: () => Observable<Array<any>>;
  public searchSpecificCallback: () => Observable<Array<any>>;
  public scrollToEndArrayCallback: () => Observable<Array<any>>;
  public searchingCallback: () => Observable<Array<any>>;

  initArrayValues = this.getInitValues.bind(this);
  searchSpecificCallback = this.getInitValues.bind(this);
  scrollToEndArrayCallback = this.simulateScrollToEndCallback.bind(this);
  searchingCallback = this.searchingCallbackValues.bind(this);

}
```

- .html

```html

<lib-ngx-custom-ng-select #customNgSelect
                          [selectId]="'testing-custom-ng-select'"
                          [items]="exampleArray"
                          [bindLabel]="'email'"
                          [bindValue]="'index'"
                          [selectedItem]="selectedItem"
                          [initLoadItems]="initArrayValues"
                          [searchExistingItemCallback]="searchSpecificCallback"
                          [scrollToEndCallback]="scrollToEndArrayCallback"
                          [searchingCallback]="searchingCallback"
                          [multiple]="isMultiple"
                          [isInError]="isInError"
                          [errorBorderColor]="'red'"
                          [placeholder]="'Insert a value'"
                          (focusEvent)="refreshValidation()"
                          (loadItemsEvent)="overWriteInitArray($event)"
                          (searchExistingItemEvent)="setSpecificValue($event)"
                          (scrollToEndEvent)="concatArray($event)"
                          (searchingParamsEvent)="changeSearchingParams($event)"
                          (searchingEvent)="overWriteSearchingArray($event)"
                          (selectedItemChangeEvent)="changeSelectedItem($event)">
</lib-ngx-custom-ng-select>
```

| Option                         | Description                                                                                                                                                                                                                           | Type                                       | Default Value           |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|-------------------------|
| `[notFound]`                   | Message when no result found                                                                                                                                                                                                          | string                                     | `'No result'`           |
| `[name]`                       | Name of html ng-select element                                                                                                                                                                                                        | string                                     | `default-custom-select` |
| `[items]`                      | Array of object that ng-select uses as values                                                                                                                                                                                         | Array of any                               |                         |
| `[selectedItem]`               | Selected item of ng-select. It can be single or array of object                                                                                                                                                                       | any                                        |                         |
| `[bindValue]`                  | Name of the object attribute that represents the object's value                                                                                                                                                                       | string                                     |                         |
| `[bindLabel]`                  | Name of the object attribute that is shown in the ng-select                                                                                                                                                                           | string                                     |                         |
| `[selectId]`                   | Id of html ng-select element                                                                                                                                                                                                          | string                                     | `ngx-custom-ng-select`  |
| `[loadingText]`                | Text that is displayed in ng-select when loading items                                                                                                                                                                                | string                                     | `Loading...`            |
| `[virtualScroll]`              | Enable virtual scroll to load only the elements visible in the ng-slect viewport                                                                                                                                                      | boolean                                    | `true`                  |
| `[bufferDim]`                  | Virtual scroll buffer size                                                                                                                                                                                                            | number                                     | `1`                     |
| `[multiple]`                   | Determines whether the ng-select will have only one selectedItem or can have more                                                                                                                                                     | boolean                                    | `false`                 |
| `[placeholder]`                | Text visible in the ng-select input when not even an element has been selected                                                                                                                                                        | string                                     |                         |
| `[disabled]`                   | Determines whether ng-select is enabled or not                                                                                                                                                                                        | boolean                                    | `false`                 |
| `[clearable]`                  | Allow to clear selected value                                                                                                                                                                                                         | boolean                                    | `true`                  |
| `[isInError]`                  | Determines whether to highlight the edge of the input with a border                                                                                                                                                                   | boolean                                    | `false`                 |
| `[errorBorderColor]`           | border color of the failing input. The color can be represented in hexadecimal or simple string                                                                                                                                       | string                                     | `red`                   |
| `[customClass]`                | Additional html classes for any custom styles                                                                                                                                                                                         | (Array of string) or (string)              |                         |
| `[addTag]`                     | Allows to create custom options                                                                                                                                                                                                       | boolean                                    | `false`                 |
| `[addTagText]`                 | Set custom text when using tagging                                                                                                                                                                                                    | string                                     |                         |
| `[returnFullObjectOnChanged]`  | when active, when the value is returned, the entire object will be returned instead of just the bindValue                                                                                                                             | boolean                                    | `false`                 |
| `[isStaticItem]`               | If active, you will not have the option to select/change the selectedItem                                                                                                                                                             | boolean                                    | `false`                 |
| `[headerTemplate]`             | Template for a possible custom header                                                                                                                                                                                                 | TemplateRef of any                         |                         |
| `[initLoadItems]`              | Callback to pass in input. It will be executed in the ngOnInit of ng-select                                                                                                                                                           | () => Observable of any                    |                         |
| `(loadItemsEvent)`             | If `[initLoadItems]` succeeds, you will be notified of the returned values. **it is the calling component's task to assign values to** `[items]`                                                                                      | Response of `[initLoadItems]`              |                         |
| `[searchExistingItemCallback]` | Callback to pass in input. It will be executed after `[initLoadItems]` if `selectedItem` exist and it's not present in  `[items]`                                                                                                     | () => Observable of any                    |                         |
| `(searchExistingItemEvent)`    | If `[searchExistingItemCallback]` succeeds, you will be notified of the returned values. **it is the calling component's task to assign values to** `[items]`                                                                         | Response of `[searchExistingItemCallback]` |                         |
| `[scrollToEndCallback]`        | Callback to pass in input. It will be executed when scroll to the bottom the ng-select                                                                                                                                                | () => Observable of any                    |                         |
| `(scrollToEndEvent)`           | If `[scrollToEndCallback]` succeeds, you will be notified of the returned values. **it is the calling component's task to assign values to** `[items]`                                                                                | Response of `[scrollToEndCallback]`        |                         |
| `[searchingCallback]`          | Callback to pass in input. It Will be called while typing on the ng-select input with a 500ms debounce. **It's triggered only if the written text is greater than 1 character, otherwise it will be triggered `[scrollToEndCallback]` | () => Observable of any                    |                         |
| `(searchingEvent)`             | If `[searchingCallback]` succeeds, you will be notified of the returned values. After that, `[searchExistingItemCallback]` will be triggered.  **it is the calling component's task to assign values to** `[items]`                   | Response of `[searchingCallback]`          |                         |
| `(searchingParamsEvent)`       | Event emitter that notifies each change of the input field while the user writes to perform a search                                                                                                                                  | string                                     |                         |
| `(resetEvent)`                 | Relaunch of `(clear)` ng-select                                                                                                                                                                                                       | boolean                                    |                         |
| `(focusEvent)`                 | Triggered when the html element gets focus                                                                                                                                                                                            | boolean                                    |                         |
| `(openEvent)`                  | Triggered when the ng-select menu is opened                                                                                                                                                                                           | boolean                                    |                         |
| `(closeEvent)`                 | Triggered when the ng-select menu is closed                                                                                                                                                                                           | boolean                                    |                         |

Credits: [Ng-select](https://www.npmjs.com/package/@ng-select/ng-select?activeTab=readme)
