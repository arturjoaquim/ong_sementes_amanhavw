import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DataTableColumn } from './datatable-column.interface';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
})
export class DataTableComponent {
  @Input() items: any[] = [];
  @Input() columns: DataTableColumn[] = [];

  /**
   * Captura o template customizado para os comandos da linha,
   * identificado pelo seletor [data-table-commands].
   */
  @ContentChild('commandsTemplate', { read: TemplateRef })
  commandsTemplateRef?: TemplateRef<any>;
}
