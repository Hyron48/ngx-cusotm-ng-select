import {MatTooltip} from '@angular/material/tooltip';
import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[matTooltip][tooltipShowIfTruncated]'
})
export class ShowIfTruncatedDirective implements OnInit {
    constructor(private matTooltip: MatTooltip,
                private elementRef: ElementRef<HTMLElement>) {
    }

    public ngOnInit(): void {
        setTimeout(() => {
            const element = this.elementRef.nativeElement;
            this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
        });
    }
}
