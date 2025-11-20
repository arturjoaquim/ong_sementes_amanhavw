import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil } from 'lucide-angular';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-base font-semibold text-gray-900">
        <ng-content></ng-content>
      </h4>
      @if (showEditButton) {
        <button
          (click)="edit.emit()"
          class="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium p-2 rounded-md hover:bg-blue-50 transition-colors -mr-2"
        >
          <lucide-icon [img]="icons.pencil" [size]="14"></lucide-icon>
          <span>Editar</span>
        </button>
      }
    </div>
  `,
})
export class SectionHeaderComponent {
  @Input() showEditButton = true;
  @Output() edit = new EventEmitter<void>();
  icons = {
    pencil: Pencil,
  };
}
