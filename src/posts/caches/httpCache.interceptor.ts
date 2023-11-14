import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      return `${cacheKey}-${request._parsedUrl.query}`;
    }

    return super.trackBy(context);
  }
}
