import {
  inject,
  Interceptor,
  InvocationContext,
  Next,
  Provider,
} from '@loopback/core';
import {
  ExpressRequestHandler,
  RequestContext,
  RestBindings,
  toInterceptor,
} from '@loopback/rest';

export class CustomOauth2Interceptor implements Provider<Interceptor> {
  constructor(
    @inject('oauth2StrategyMiddleware')
    public oauth2Strategy: ExpressRequestHandler,
  ) {}

  value() {
    return async (invocationCtx: InvocationContext, next: Next) => {
      const requestCtx = invocationCtx.getSync<RequestContext>(
        RestBindings.Http.CONTEXT,
      );
      const request = requestCtx.request;
      if (request.query['oauth2-provider-name'] === 'oauth2') {
        return toInterceptor(this.oauth2Strategy)(invocationCtx, next);
      }
      return next();
    };
  }
}
