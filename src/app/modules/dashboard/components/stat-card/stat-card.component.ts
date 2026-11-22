import { Component, input } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  standalone: true,
  imports: [CardComponent, LucideAngularModule, CommonModule],
})
export class StatCardComponent {
  value = input<string>('');
  title = input<string>('');
  iconColor = input<string>('');
  change = input<string>('');
  changeType = input<string>('');
  icon = input<LucideIconData | undefined>(undefined);
  iconBg = input<string>('');
}
