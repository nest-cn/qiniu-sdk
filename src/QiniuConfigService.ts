import { Inject, Injectable, Optional } from '@nestjs/common';
import { QiniuOptionsInterfaces } from "./QiniuInterfaces";
import { QINIU_MODULE_OPTIONS } from "./QiniuConstants";

@Injectable()
export class QiniuConfigService {
    private options: QiniuOptionsInterfaces = {};
    constructor(
        @Optional()
        @Inject(QINIU_MODULE_OPTIONS)
        private readonly qiniuOptions: QiniuConfigService
    ) {
        this.options = Object.assign(this.options, qiniuOptions);
    }

    get config() {
        return this.options;
    }

    set config(value: QiniuOptionsInterfaces) {
        this.options = Object.assign(this.options, value);
    }
}
