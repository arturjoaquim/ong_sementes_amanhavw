import { Component, Input, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialInteractionPlace, Student } from '../../types/student.type';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { LucideAngularModule, ToyBrick, Users } from 'lucide-angular';
import { Dialog } from '@angular/cdk/dialog';
import { SectionHeaderComponent } from './section-header.component';
import {
  InteractionLevelMap,
  PlaceMap,
  SocialActivityTypeMap,
  SocialGroupMap,
} from '../../../../shared/utils/lookup.enums';
import { ButtonDirective } from '../../../../shared/directives/button.directive';

@Component({
  selector: 'app-student-social-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SectionHeaderComponent,
    LucideAngularModule,
    ButtonDirective,
  ],
  templateUrl: './student-social-detail.component.html',
})
export class StudentSocialDetailComponent {
  @Input({ required: true }) student!: WritableSignal<Student>;
  private dialog = inject(Dialog);

  icons = {
    users: Users,
    toyBrick: ToyBrick,
  };

  addSocialActivity() {
    console.log('Adicionar nova atividade social');
    // Aqui você abriria um diálogo para criar uma nova atividade social
  }

  get socialInteractions() {
    return this.student().socialInteractions;
  }

  getSocialGroupName(socialGroupId: number): string {
    return SocialGroupMap[socialGroupId]?.descricao || 'Não informado';
  }

  getInteractionLevel(interactionLevelId: number): string {
    return InteractionLevelMap[interactionLevelId]?.descricao || 'Não informado';
  }

  getPlaceNames(places: SocialInteractionPlace[]): string {
    if (!places || places.length === 0) {
      return 'Nenhum local especificado';
    }
    return places.map((p) => PlaceMap[p.placeId]?.descricao).join(', ');
  }

  getSocialActivityTypeName(activityTypeId: number): string {
    return SocialActivityTypeMap[activityTypeId]?.descricao || 'Não informado';
  }

  getInteractionBadgeColor(interactionLevelId: number): string {
    switch (interactionLevelId) {
      case 1: // Bom
        return 'bg-green-100 text-green-700';
      case 2: // Regular
        return 'bg-yellow-100 text-yellow-700';
      case 3: // Ruim
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
