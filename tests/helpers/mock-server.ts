import http from 'http';

/**
 * Mock upstream API server for integration testing.
 * Simulates various provider behaviors: success, 429 rate limits, 5xx errors, timeouts.
 */
export class MockUpstreamServer {
  private server: http.Server;
  private requestCount: number = 0;
  private port: number = 0;
  private readonly behavior: 'always_success' | 'intermittent_429' | 'always_fail_500' | 'timeout';

  constructor(
    behavior: 'always_success' | 'intermittent_429' | 'always_fail_500' | 'timeout' = 'always_success',
  ) {
    this.behavior = behavior;
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    this.requestCount++;

    const latency = this.behavior === 'timeout' ? 5000 : 50;

    setTimeout(() => {
      if (this.behavior === 'timeout') {
        return;
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');

      if (this.behavior === 'intermittent_429' && this.requestCount % 2 === 0) {
        res.writeHead(429, {
          'Retry-After': '1',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 1),
          'X-RateLimit-Remaining': '0',
        });
        res.end(
          JSON.stringify({
            error: { code: 'rate_limit_exceeded', message: 'Too many requests' },
          }),
        );
        return;
      }

      if (this.behavior === 'always_fail_500') {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            error: { code: 'internal_error', message: 'Internal server error' },
          }),
        );
        return;
      }

      const url = new URL(req.url ?? '/', `http://localhost:${this.port}`);
      const params = Object.fromEntries(url.searchParams.entries());

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            success: true,
            method: req.method,
            path: url.pathname,
            params,
            body: body ? JSON.parse(body) : null,
            headers: {
              'content-type': req.headers['content-type'],
              'x-api-key': req.headers['x-api-key'] ?? null,
            },
            mock_server: true,
            request_number: this.requestCount,
            current: {
              temp_c: 22.5,
              condition: { text: 'Sunny' },
              humidity: 65,
              wind_kph: 15.3,
              wind_dir: 'NNE',
            },
            location: {
              name: 'Test City',
              region: 'Test Region',
              country: 'Test Country',
              lat: 51.5,
              lon: -0.13,
            },
          }),
        );
      });
    }, latency);
  }

  async start(): Promise<number> {
    return new Promise((resolve) => {
      this.server.listen(0, '127.0.0.1', () => {
        const addr = this.server.address();
        if (addr && typeof addr === 'object') {
          this.port = addr.port;
        }
        resolve(this.port);
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => resolve());
    });
  }

  getRequestCount(): number {
    return this.requestCount;
  }

  getPort(): number {
    return this.port;
  }
}
