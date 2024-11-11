import {
  Component,
  inject,
  makeStateKey,
  TransferState,
  VERSION,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { REQUEST, REQUEST_CONTEXT } from '@angular/ssr/tokens';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ssr-19-issue';
  version = VERSION.full;
  server: string | undefined;
  transferState = inject(TransferState);
  serverKey = makeStateKey<string>('server');

  constructor() {
    const request = inject(REQUEST, { optional: true });
    console.log(request);
    if (request) {
      console.log('Server received a request', request.url);
    }

    const reqContext = inject(REQUEST_CONTEXT, { optional: true }) as {
      server: string;
    };
    if (reqContext) {
      this.server = reqContext.server;

      this.transferState.set(this.serverKey, this.server);
    }
    this.server = this.transferState.get(this.serverKey, '');
  }
}
