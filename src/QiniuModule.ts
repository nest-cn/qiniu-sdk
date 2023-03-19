import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { QiniuAsyncOptionsInterfaces, QiniuOptionsFactory, QiniuOptionsInterfaces } from './QiniuInterfaces';
import { QINIU_MODULE_OPTIONS, QINIU_MODULE_OPTIONS_SERVICE } from './QiniuConstants';
import { QiniuService } from './QiniuService';
import { QiniuConfigService } from "./QiniuConfigService";

@Global()
@Module({
  providers: [ QiniuService ],
  exports: [ QiniuService, QINIU_MODULE_OPTIONS_SERVICE, QINIU_MODULE_OPTIONS ],
})
export class QiniuModule {
  static register(options: QiniuOptionsInterfaces): DynamicModule {
    return {
      global: true,
      module: QiniuModule,
      providers: [
          {
              provide: QINIU_MODULE_OPTIONS_SERVICE,
              useClass: QiniuConfigService,
          },
          {
              provide: QINIU_MODULE_OPTIONS,
              useValue: options,
          }
      ],
      exports: [ QINIU_MODULE_OPTIONS_SERVICE, QINIU_MODULE_OPTIONS ],
    };
  }

  static registerAsync(options: QiniuAsyncOptionsInterfaces): DynamicModule {
    return {
      module: QiniuModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(options: QiniuAsyncOptionsInterfaces): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [ this.createAsyncOptionsProvider(options) ];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: QiniuAsyncOptionsInterfaces): Provider {
    if (options.useFactory) {
      return {
        provide: QINIU_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: QINIU_MODULE_OPTIONS,
      useFactory: async (optionsFactory: QiniuOptionsFactory) => await optionsFactory.createQiniuOptions(),
      inject: [ options.useExisting || options.useClass ],
    };
  }
}
