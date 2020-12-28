import type { RequestHandler } from "express";

export default function isGraphqlRequest() {
  return ((req: any, _res, next) => {
    console.log(req.path);
    if (
      ["/client", "/static", "/service-worker"].some((v) =>
        req.path.includes(v)
      )
    ) {
      req.checkSession = false;
    } else {
      req.checkSession = true;
    }
    return next();
  }) as RequestHandler;
}
