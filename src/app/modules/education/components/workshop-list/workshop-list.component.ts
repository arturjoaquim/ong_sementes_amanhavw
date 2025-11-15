
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eye, LucideAngularModule, Users, Clock } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Workshop } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
  ],
})
export class WorkshopListComponent {
  icons = {
    users: Users,
    eye: Eye,
    clock: Clock,
  };

  @Input() workshops: Workshop[] = [];
  @Output() viewWorkshopDetail = new EventEmitter<Workshop>();

  viewDetails(workshop: Workshop) {
    this.viewWorkshopDetail.emit(workshop);
  }

  getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Artes': 'bg-purple-100 text-purple-700',
      'Música': 'bg-pink-100 text-pink-700',
      'Teatro': 'bg-indigo-100 text-indigo-700',
      'Tecnologia': 'bg-blue-100 text-blue-700',
      'Esportes': 'bg-green-100 text-green-700',
      'Literatura': 'bg-orange-100 text-orange-700',
      'Gastronomia': 'bg-red-100 text-red-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  getScheduleText(workshop: Workshop): string {
    if (workshop.schedule.length === 0) return 'Sem horários definidos';
    if (workshop.schedule.length === 1) {
      const s = workshop.schedule[0];
      return `${s.dayOfWeek} • ${s.startTime}-${s.endTime}`;
    }
    return `${workshop.schedule.length} horários`;
  }
}
