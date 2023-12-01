import { Directive, ElementRef, inject, NgZone, OnInit } from '@angular/core';

@Directive({
  selector: 'ax-highlight-on-cd',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  private zone = inject(NgZone);
  private host = inject(ElementRef);

  ngOnInit() {
    this.host.nativeElement.className =
      'block p-2 px-6  my-4 rounded-xl border-2 border-gray-300 bg-gray-200';
    this.host.nativeElement.style.transition = 'all 300ms';
  }

  highlight() {
    this.host.nativeElement.classList.add('bg-fuchsia-300');

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.host.nativeElement.classList.remove('bg-fuchsia-300');
      }, 600);
    });
  }
}
