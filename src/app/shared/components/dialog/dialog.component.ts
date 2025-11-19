import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
})
export class DialogComponent implements AfterViewInit {
  @Input() contentClass = '';
  xIcon = X;
  dialogRef = inject(DialogRef);
  @ViewChild('dialogContent', { read: ElementRef }) dialogContent!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => (this.dialogContent.nativeElement.scrollTop = 0), 0);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-description',
  template: `
    <div [ngClass]="[contentClass, 'text-muted-foreground text-sm']"><ng-content></ng-content></div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DialogDescriptionComponent {
  @Input() contentClass = '';
}

@Component({
  selector: 'app-dialog-header',
  template: `<div [ngClass]="[contentClass, 'flex flex-col gap-2 text-center sm:text-left']">
    <ng-content></ng-content>
  </div> `,
  standalone: true,
  imports: [CommonModule],
})
export class DialogHeaderComponent {
  @Input() contentClass = '';
}

@Component({
  selector: 'app-dialog-title',
  template: `
    <div [ngClass]="[contentClass, 'text-lg leading-none font-semibold']">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DialogTitleComponent {
  @Input() contentClass = '';
}
