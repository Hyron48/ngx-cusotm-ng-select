import { NgModule } from '@angular/core';
import { NgxCustomNgSelectComponent } from './components/ngx-custom-ng-select/ngx-custom-ng-select.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {ShowIfTruncatedDirective} from './directives/show-if-truncated.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';



@NgModule({
  declarations: [
    NgxCustomNgSelectComponent,
    ShowIfTruncatedDirective
  ],
  imports: [
    NgSelectModule,
    FormsModule,
    MatTooltipModule,
    NgClass,
    NgIf,
    NgTemplateOutlet
  ],
  exports: [
    NgxCustomNgSelectComponent
  ]
})
export class NgxCustomNgSelectModule { }
