declare module '@sapper/app' {
  import type { Writable } from 'svelte/store';

  interface Session {
    user: {
      id: number;
      email: string;
      role: 0;
      confirmToken: string,
      confirmed: boolean,
    };
  }

  interface Page {
    host: string;
		path: string;
		params: Record<string, string>;
		query: Record<string, string | string[]>;
		error?: Error;
  }

  interface Redirect {
    statusCode: number;
    location: string;
  }

  interface gotoOpts {
    replaceState: boolean;
  }
  function goto(href: string, opts?: gotoOpts): Promise<unknown>;
  function prefetch(
    href: string
  ): Promise<{ redirect?: Redirect; data?: unknown }>;
  function prefetchRoutes(pathnames: string[]): Promise<unknown>;
  function start(opts: { target: Node }): Promise<unknown>;
  const stores: () => { session: Writable<Session>; page: Writable<Page> };

  export { goto, prefetch, prefetchRoutes, start, stores };
}

declare module '@sapper/server' {
  import { RequestHandler } from 'express';

  interface MiddlewareOptions {
    session?: (req: Express.Request, res: Express.Response) => unknown;
    ignore?: unknown;
  }

  function middleware(opts?: MiddlewareOptions): RequestHandler;

  export { middleware };
}

declare module '@sapper/service-worker' {
  const timestamp: number;
  const files: string[];
  const shell: string[];
  const routes: { pattern: RegExp }[];

  export { timestamp, files, files as assets, shell, routes };
}
