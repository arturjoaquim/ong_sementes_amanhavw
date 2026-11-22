import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-detail-field',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  template: `
    <div class="flex items-start gap-3">
      <div class="p-2 rounded-lg" [ngClass]="iconBgColor()">
        <lucide-icon [img]="icon()" [size]="18" [ngClass]="iconColor()"></lucide-icon>
      </div>
      <div>
        <p class="text-xs text-gray-500">{{ label() }}</p>
        <p class="text-sm text-gray-900 mt-1">{{ value() }}</p>
      </div>
    </div>
  `,
})
export class DetailFieldComponent {
  label = input<string>('');
  value = input<string | number | undefined | null>('');
  icon = input.required<LucideIconData>();
  iconBgColor = input<string>('bg-gray-50');
  iconColor = input<string>('text-gray-600');
}
