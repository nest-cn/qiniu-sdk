import { QiniuOptionsInterfaces } from './QiniuInterfaces';
import { QINIU_MODULE_OPTIONS, QINIU_MODULE_OPTIONS_SERVICE } from './QiniuConstants';
import { QiniuConfigService } from "./QiniuConfigService";

export function createQiniuProvider(options: QiniuOptionsInterfaces): any[] {
  return [ { provide: QINIU_MODULE_OPTIONS, useValue: options || {} } ];
}


export function createQiniuConfigProvider(): { useClass: {}; provide: string }[] {
    return [ { provide: QINIU_MODULE_OPTIONS_SERVICE, useClass: QiniuConfigService || {} } ];
}
