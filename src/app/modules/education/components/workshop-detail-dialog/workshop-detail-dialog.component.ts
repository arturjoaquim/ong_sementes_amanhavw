
import { Component, inject } from '@angular/core';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../../../../shared/components/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Workshop } from '../../types/workshop.type';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { LucideAngularModule, User, Calendar, MapPin, Users, Clock, Link } from 'lucide-angular';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-workshop-detail-dialog',
  templateUrl: './workshop-detail-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogHeaderComponent,
    DialogComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    BadgeComponent,
    LucideAngularModule,
    CardComponent,
  ],
})
export class WorkshopDetailDialogComponent {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef>(DialogRef);
  
  workshop: Workshop = this.data.workshop;
  
  icons = {
    user: User,
    calendar: Calendar,
    mapPin: MapPin,
    users: Users,
    clock: Clock,
    link: Link,
  };

  getStatusColor(status: string): string {
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
  }

  getTypeColor(type: string): string {
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
  }
}
