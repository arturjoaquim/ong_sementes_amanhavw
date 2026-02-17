
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

  getStatusColor(active: boolean): string {
    return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  }
}
