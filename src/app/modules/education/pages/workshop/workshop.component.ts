import { Component, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, Briefcase } from 'lucide-angular';
import { WorkshopSearchComponent } from '../../components/workshop-search/workshop-search.component';
import { WorkshopListComponent } from '../../components/workshop-list/workshop-list.component';
import { Workshop } from '../../types/workshop.type';
import { Dialog } from '@angular/cdk/dialog';
import { WorkshopDetailDialogComponent } from '../../components/workshop-detail-dialog/workshop-detail-dialog.component';
import { WorkshopFormDialogComponent } from '../../components/workshop-form-dialog/workshop-form-dialog.component';
import { WorkshopService } from '../../services/workshop.service';
import { WorkshopPreview } from '../../types/workshop-preview.type';
import { WorkshopSessionFormDialogComponent } from '../../components/workshop-session-form-dialog/workshop-session-form-dialog.component';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  imports: [
    LucideAngularModule,
    WorkshopSearchComponent,
    WorkshopListComponent,
    PageLayoutComponent,
  ],
  standalone: true,
})
export class WorkshopComponent implements OnInit {
  icons = {
    briefcase: Briefcase,
  };

  dialog = inject(Dialog);
  workshopService = inject(WorkshopService);

  workshops = signal<WorkshopPreview[]>([]);

  ngOnInit() {
    this.loadWorkshops();
  }

  loadWorkshops() {
    this.workshopService.getWorkshopsPreview().subscribe((previews) => {
      this.workshops.set(previews);
    });
  }

  showListResult(workshops: WorkshopPreview[]) {
    this.workshops.set(workshops);
  }

  showWorkshopDetails(workshopPreview: WorkshopPreview) {
    this.workshopService.getWorkshopById(workshopPreview.id).subscribe({
      next: (workshop) => {
        this.dialog.open(WorkshopDetailDialogComponent, {
          data: { workshop },
          width: '90vw',
          maxWidth: '1200px',
        });
      },
      error: (err) => {
        console.error('Workshop not found details', err);
      },
    });
  }

  handleCreateWorkshop(workshop?: Workshop) {
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
          this.workshopService.createWorkshop(result).subscribe({
            next: () => {
              alert('Oficina criada com sucesso!');
              this.loadWorkshops();
            },
            error: (err) => {
              console.error('Erro ao criar oficina', err);
              alert('Erro ao criar oficina.');
            },
          });
        }
      }
    });
  }

  handleCreateSession() {
    const dialogRef = this.dialog.open(WorkshopSessionFormDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        alert('Sessão criada com sucesso!');
        this.loadWorkshops();
      }
    });
  }
}
