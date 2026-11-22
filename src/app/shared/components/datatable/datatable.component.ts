import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';
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
  items = input<T[]>([]);
  columns = input<DataTableColumn[]>([]);
  paginator = input<boolean>(true);
  rows = input<number>(10);
  rowsPerPageOptions = input<number[]>([5, 10, 20, 50]);

  @ContentChild('commandsTemplate', { read: TemplateRef })
  commandsTemplateRef?: TemplateRef<any>;
}
