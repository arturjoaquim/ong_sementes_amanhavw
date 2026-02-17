import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Eye, LucideAngularModule, User, Mail, Phone } from 'lucide-angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { EmployeePreview } from '../../types/employee-preview.type';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '../../../../shared/directives/button.directive';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import {PositionTypeMap} from '../../../../shared/utils/lookup.enums';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonDirective, CardComponent, BadgeComponent],
})
export class EmployeeListComponent {
  icons = {
    user: User,
    eye: Eye,
    mail: Mail,
    phone: Phone,
  };

  @Input() employees: EmployeePreview[] = [];
  @Output() viewEmployeeDetail = new EventEmitter<EmployeePreview>();

  viewDetails(employee: EmployeePreview) {
    this.viewEmployeeDetail.emit(employee);
  }

  getPositionName(positionId: number): string {
    return PositionTypeMap[positionId].name;
  }
}
