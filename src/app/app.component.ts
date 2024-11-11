import { Component, inject, makeStateKey, TransferState, VERSION } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { REQUEST, REQUEST_CONTEXT } from '@angular/ssr/tokens';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test-ssr';
  version = VERSION.full;
  server: string | undefined;
  transferState = inject(TransferState);
  serverKey = makeStateKey<string>('server');

  constructor() {
    const request = inject(REQUEST, { optional: true });
    console.log(request)
    if (request) {
      const cookie = request.headers.get('cookie');
      console.log(cookie)
      console.log('Server received a request', request.url);
    }

    const reqContext = inject(REQUEST_CONTEXT, { optional: true }) as {
      server: string;
    };
    if (reqContext) {
      // The context is defined in the server*.ts file
      this.server = reqContext.server;

      // Store this as this won't be available on hydration
      this.transferState.set(this.serverKey, this.server);
    }
    this.server = this.transferState.get(this.serverKey, '');
  }
}
