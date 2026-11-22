import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 md:p-8 space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <ng-content select="[page-icon]" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">{{ title() }}</h1>
            @if (description()) {
              <p class="text-sm text-muted-foreground mt-0.5">{{ description() }}</p>
            }
          </div>
        </div>

        <!-- Page Actions (New Record, Export, etc.) -->
        <div class="flex items-center gap-3 self-start sm:self-auto">
          <ng-content select="[page-actions]" />
        </div>
      </div>

      <!-- Search & Filters Container (Optional projection) -->
      <div>
        <ng-content select="[page-filters]" />
      </div>

      <!-- Main Content (Table / List) -->
      <div>
        <ng-content />
      </div>
    </div>
  `,
})
export class PageLayoutComponent {
  title = input.required<string>();
  description = input<string>('');
}
