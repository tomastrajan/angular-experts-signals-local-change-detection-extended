import 'zone.js';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  inject,
  Injectable,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { HighlightDirective } from './highlight.directive';

@Injectable({ providedIn: 'root' })
export class CounterService {
  counter = signal(0);
  increment() {
    this.counter.update((count) => count + 1);
  }
}

@Component({
  selector: 'ax-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="cursor-default inline-block rounded-xl py-1 px-2 bg-blue-500 text-sm">
    <span class="text-blue-200 inline-block mr-2">{{title}}</span>
    <span class="text-white font-bold">{{count}}</span>
  </div>
  `,
})
export class CounterComponent {
  @Input() title = 'Counter';
  @Input() count = 0;
}

@Component({
  selector: 'ax-child',
  standalone: true,
  imports: [CounterComponent],
  hostDirectives: [HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{cd()}}
  <div class="flex items-center gap-2 mb-4">
    <h1 class="inline-block text-2xl font-bold">Child</h1>
    <ax-counter title="CD" [count]="cdCount"/>
    <ax-counter title="Signal" [count]="signal()"/>
    <ax-counter title="Prop" [count]="prop"/>
    
    @if(depth === 1) {
      <ax-counter title="From service" [count]="counterService.counter()"/>
    }
  </div>
  <button  class="btn mb-4 mr-2" (click)="increment()">Increment</button>
  <button  class="btn mb-4 mr-2" (click)="incrementProp()">Increment (prop)</button>
  @if (!intervalId) {
    <button  class="btn mb-4 mr-2" (click)="start()">Start increment on interval</button>
  } @else {
    <button  class="btn mb-4 mr-2" (click)="stop()">Stop increment on interval</button>  
  }
  @if(depth === 0) {
    <button  class="btn mb-4 mr-2" (click)="counterService.increment()">Increment (service)</button>
  }
  
  
  @if (depth > 1) {
    <ax-child [depth]="depth - 1" />
  }
`,
})
export class ChildComponent {
  private highlight = inject(HighlightDirective);
  counterService = inject(CounterService);

  @Input() depth = 0;

  signal = signal(0);
  intervalId?: number;
  cdCount = 0;
  prop = 0;

  cd() {
    this.cdCount++;
    this.highlight.highlight();
  }
  incrementProp() {
    this.prop++;
  }
  increment() {
    this.signal.set(this.signal() + 1);
  }
  start() {
    this.intervalId = setInterval(() => {
      this.increment();
    }, 1000);
  }
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
}

@Component({
  selector: 'ax-root',
  standalone: true,
  imports: [CounterComponent, ChildComponent],
  hostDirectives: [HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{cd()}}
    <div class="flex items-center gap-2 mb-4">
      <h1 class="text-3xl font-bold">Angular Signals</h1>
      <ax-counter title="CD" [count]="cdCount"/>
    </div>

    <h2  class="text-xl font-bold mb-4">Local change detection (Signals + OnPush) Extended Example</h2>  

    <p class="text-lg mb-4">The <span class="font-bold text-fuchsia-500">pink</span> pulse indicates that the components template bindings and expressions were re-run as a result of change detection...</p>

    <ul class="list-disc ml-4">
      <li class="pb-1">Initial CD on application startup</li>
      <li class="pb-1">Clicking "Increment" button (event) trigger standard <code>OnPush</code> CD (sub-tree)</li>
      <li class="pb-1">Signal updates without CD trigger, eg timeout, interval, or from some service, will trigger only local CD for the <code>OnPush</code> component!</li>
    </ul>

    <ax-child [depth]="3" />
    <ax-child />
  `,
})
export class App {
  private highlight = inject(HighlightDirective);
  cdCount = 0;
  cd() {
    this.cdCount++;
    this.highlight.highlight();
  }
}

bootstrapApplication(App);
