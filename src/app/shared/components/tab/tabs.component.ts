import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tab } from '../../types/tab.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        @for (tab of tabs; track tab.id) {
          <button
            (click)="selectTab(tab.id)"
            [ngClass]="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            {{ tab.label }}
          </button>
        }
      </nav>
    </div>
  `,
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab: string | null = null;
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    this.tabChange.emit(tabId);
  }
}
