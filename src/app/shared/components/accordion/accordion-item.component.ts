import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="border border-gray-200 rounded-lg">
      <button
        type="button"
        class="w-full flex items-center justify-between p-4 text-left"
        (click)="toggled.emit()"
      >
        <ng-content select="app-accordion-header"></ng-content>
        <lucide-icon
          [img]="icons.chevronDown"
          [size]="20"
          class="text-gray-500 transition-transform"
          [class.rotate-180]="isOpen"
        ></lucide-icon>
      </button>

      @if (isOpen) {
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <ng-content select="app-accordion-body"></ng-content>
        </div>
      }
    </div>
  `,
})
export class AccordionComponent {
  @Input({ required: true }) isOpen!: boolean;
  @Output() toggled = new EventEmitter<void>();
  icons = { chevronDown: ChevronDown };
}

@Component({
  selector: 'app-accordion-header',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content> `,
})
export class AccordionHeaderComponent {}

@Component({
  selector: 'app-accordion-body',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content>`,
})
export class AccordionBodyComponent {}
