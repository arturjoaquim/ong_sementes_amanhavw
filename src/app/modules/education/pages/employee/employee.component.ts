import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, Briefcase } from 'lucide-angular';
import { EmployeeSearchComponent } from '../../components/employee-search/employee-search.component';
import { EmployeeListComponent } from '../../components/employee-list/employee-list.component';
import { EmployeePreview } from '../../types/employee-preview.type';
import { EmployeeService } from '../../services/employee.service';
import { Dialog } from '@angular/cdk/dialog';
import { EmployeeCreationDialogComponent } from '../../components/employee-creation-dialog/employee-creation-dialog.component';
import { EmployeeDetailDialogComponent } from '../../components/employee-detail-dialog/employee-detail-dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  imports: [LucideAngularModule, EmployeeSearchComponent, EmployeeListComponent],
  standalone: true,
})
export class EmployeeComponent implements OnInit {
  icons = {
    briefcase: Briefcase,
  };

  private employeeService = inject(EmployeeService);
  private dialog = inject(Dialog);

  employees: EmployeePreview[] = [];

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployeesPreview().subscribe((data) => {
      this.employees = data;
    });
  }

  showListResult(employees: EmployeePreview[]) {
    this.employees = employees;
  }

  openCreationDialog() {
    const dialogRef = this.dialog.open(EmployeeCreationDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  showEmployeeDetails(employeePreview: EmployeePreview) {
    this.employeeService.getEmployeeById(employeePreview.id).subscribe((employee) => {
      const dialogRef = this.dialog.open(EmployeeDetailDialogComponent, {
        data: { employee },
        width: '90vw',
        maxWidth: '1200px',
      });

      dialogRef.closed.subscribe((result) => {
        if (result) {
          this.loadEmployees();
        }
      });
    });
  }
}
