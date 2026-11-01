import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DataTableColumn } from './datatable-column.interface';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
})
export class DataTableComponent<T = any> {
  @Input() items: T[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];

  /**
   * Captura o template customizado para os comandos da linha,
   * identificado pelo seletor [data-table-commands].
   */
  @ContentChild('commandsTemplate', { read: TemplateRef })
  commandsTemplateRef?: TemplateRef<any>;
}
