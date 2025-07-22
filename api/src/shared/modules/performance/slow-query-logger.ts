import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContextService } from './request-context.service';

export function patchSlowQueryLoggingGlobal(
  orm: MikroORM,
  ctxService: RequestContextService,
  thresholdMs = 200,
) {
  const driver = orm.em.getDriver();
  const originalExec = driver.execute.bind(driver);

  driver.execute = async function (...args: any[]) {
    const start = Date.now();
    const result = await originalExec(...args);
    const duration = Date.now() - start;

    if (duration > thresholdMs) {
      const query = args[0];
      const params = args[1];
      const req = ctxService.getRequest();

      req?.['_queryStats']?.push({
        query,
        time: duration,
        params,
      });
    }

    return result;
  };
}
