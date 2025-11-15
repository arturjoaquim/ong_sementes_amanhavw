
import { Component, inject } from '@angular/core';
import { LucideAngularModule, Briefcase } from 'lucide-angular';
import { WorkshopSearchComponent } from '../../components/workshop-search/workshop-search.component';
import { WorkshopListComponent } from '../../components/workshop-list/workshop-list.component';
import { Workshop } from '../../types/workshop.type';
import { Dialog } from '@angular/cdk/dialog';
import { WorkshopDetailDialogComponent } from '../../components/workshop-detail-dialog/workshop-detail-dialog.component';
import { WorkshopFormDialogComponent } from '../../components/workshop-form-dialog/workshop-form-dialog.component';
import { WorkshopService } from '../../services/workshop.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  imports: [LucideAngularModule, WorkshopSearchComponent, WorkshopListComponent],
  standalone: true,
})
export class WorkshopComponent {
  icons = {
    briefcase: Briefcase,
  };

  dialog = inject(Dialog);
  workshopService = inject(WorkshopService);

  workshops: Workshop[] = [];

  showListResult(workshops: Workshop[]) {
    this.workshops = workshops;
  }

  showWorkshopDetails(workshop: Workshop) {
    this.dialog.open(WorkshopDetailDialogComponent, {
      data: { workshop },
      width: '90vw',
      maxWidth: '1200px',
    });
  }

  handleCreateWorkshop(workshop: Workshop | undefined) {
    const dialogRef = this.dialog.open<Workshop>(WorkshopFormDialogComponent, {
      data: { workshop },
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        if (workshop) {
          this.workshopService.updateWorkshop(result);
        } else {
          this.workshopService.createWorkshop(result);
        }
      }
    });
  }
}
