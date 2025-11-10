import { Component, Input } from '@angular/core';
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
  @Input() value = '';
  @Input() title = '';
  @Input() iconColor = '';
  @Input() change = '';
  @Input() changeType = '';
  @Input() icon?: LucideIconData;
  @Input() iconBg = '';
}
