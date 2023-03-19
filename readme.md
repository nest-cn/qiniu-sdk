## NestJs qiniu sdk

### Description

A NestJS - qiniu, wrapping on [qiniu](https://developer.qiniu.com/kodo/sdk/nodejs)

### Installation

```bash
npm install nestjs-qiniu
```

### Add it to the NestJS app.module.ts or any module

```ts
import { QiniuModule } from 'nestjs-qiniu';

@Module({
    imports: [
        QiniuModule.register({
            global: true,
            access_key: 'access_key',
            secret_key: 'secret_key',
            bucket: 'bucket',
            domain: 'http://bucket.test',
        }),
    ],
    controllers: [],
    providers: [],
})
export class Module {}
```

### How to use

```ts
import { QiniuService } from "nestjs-qiniu";

@Injectable()
export class TestService{
    constructor(@Inject(QiniuService) private readonly qiniuService: QiniuService) {}
    
    public getQiniuConfig() {
        return this.qiniuService.options;
    }

    public updateQiniuConfig() {
        this.qiniuService.updateOptions({
            access_key: 'access_key',
            secret_key: 'secret_key',
            bucket: 'bucket',
            domain: 'http://bucket.test',
            // 
        });
    }
    
}

```
