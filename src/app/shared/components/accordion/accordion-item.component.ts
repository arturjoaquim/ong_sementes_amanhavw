import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="border border-gray-200 rounded-lg">
      <div class="w-full flex items-center justify-between p-4 text-left">
        <button
          class="grow cursor-pointer text-left bg-transparent border-0 p-0"
          (click)="toggled.emit()"
          (keydown.enter)="toggled.emit()"
          (keydown.space)="toggled.emit()"
        >
          <ng-content select="app-accordion-header"></ng-content>
        </button>

        <div class="flex items-center gap-3 ml-4">
          @if (showEditButton) {
            <button
              (click)="edit.emit(); $event.stopPropagation()"
              class="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
              title="Editar"
            >
              <lucide-icon [img]="icons.pencil" [size]="16"></lucide-icon>
            </button>
          }

          @if (showRemoveButton) {
            <button
              (click)="remove.emit(); $event.stopPropagation()"
              class="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Remover"
            >
              <lucide-icon [img]="icons.trash2" [size]="16"></lucide-icon>
            </button>
          }
        </div>

        <lucide-icon
          [img]="icons.chevronDown"
          [size]="20"
          class="text-gray-500 transition-transform ml-3 cursor-pointer"
          [class.rotate-180]="isOpen"
          (click)="toggled.emit()"
        ></lucide-icon>
      </div>

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
  @Input() showEditButton = false;
  @Input() showRemoveButton = false;
  @Output() toggled = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  icons = { chevronDown: ChevronDown, pencil: Pencil, trash2: Trash2 };
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
