import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<span
    [ngClass]="[contentClass(), 'relative flex size-10 shrink-0 overflow-hidden rounded-full']"
    ><ng-content></ng-content
  ></span>`,
  standalone: true,
  imports: [CommonModule],
})
export class AvatarComponent {
  contentClass = input<string>('');
}

@Component({
  selector: 'app-avatar-fallback',
  template: `<span
    [ngClass]="[contentClass(), 'bg-muted flex size-full items-center justify-center rounded-full']"
    ><ng-content></ng-content
  ></span>`,
  standalone: true,
  imports: [CommonModule],
})
export class AvatarFallbackComponent {
  contentClass = input<string>('');
}
