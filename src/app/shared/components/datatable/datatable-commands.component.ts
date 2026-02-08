import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-data-table-commands',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center justify-end gap-3">
      <button (click)="edit.emit(item)" class="text-gray-500 hover:text-blue-600" title="Editar">
        <lucide-icon [img]="icons.pencil" size="16"></lucide-icon>
      </button>
      <button (click)="delete.emit(item)" class="text-gray-500 hover:text-red-600" title="Excluir">
        <lucide-icon [img]="icons.trash2" size="16"></lucide-icon>
      </button>
    </div>
  `,
})
export class DataTableCommandsComponent {
  @Input({ required: true }) item: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  icons = {
    pencil: Pencil,
    trash2: Trash2,
  };
}
