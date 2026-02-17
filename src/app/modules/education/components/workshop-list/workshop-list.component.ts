import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eye, LucideAngularModule, Users, Clock } from 'lucide-angular';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { WorkshopPreview } from '../../types/workshop-preview.type';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BadgeComponent, ButtonDirective, CardComponent],
})
export class WorkshopListComponent {
  icons = {
    users: Users,
    eye: Eye,
    clock: Clock,
  };

  @Input() workshops: WorkshopPreview[] = [];
  @Output() viewWorkshopDetail = new EventEmitter<WorkshopPreview>();

  viewDetails(workshop: WorkshopPreview) {
    this.viewWorkshopDetail.emit(workshop);
  }

  getStatusColor(active: boolean): string {
    return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  }
}
