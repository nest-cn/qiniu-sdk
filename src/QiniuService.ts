import { Inject, Injectable, Optional } from '@nestjs/common';
import { QiniuOptionsInterfaces } from './QiniuInterfaces';
import { QINIU_MODULE_OPTIONS_SERVICE } from './QiniuConstants';
import * as qiniu from 'qiniu';
import { QiniuConfigService } from "./QiniuConfigService";

@Injectable()
export class QiniuService {
  constructor(
    @Optional()
    @Inject(QINIU_MODULE_OPTIONS_SERVICE)
    private readonly optionsService: QiniuConfigService,
  ) {}

  public get options() {
      return this.optionsService.config;
  }

    /**
     * 读取配置
     * @param key
     */
  public getOptions(key = null): QiniuOptionsInterfaces | any {
    return key ? this.options[key] : this.options;
  }

    /**
     * 更新配置
     * @param value
     */
  public updateOptions(value: QiniuOptionsInterfaces = {}) {
      this.optionsService.config = Object.assign(this.options, value);
  }

  public getZone(): qiniu.conf.Zone {
    return this.options.zone;
  }

  public getBucket(): string {
    return this.options.bucket;
  }

  public getDomain(): string {
    return this.options.domain;
  }

  public mac(): qiniu.auth.digest.Mac {
    return new qiniu.auth.digest.Mac(this.options.access_key, this.options.secret_key, this.options.mac_options);
  }

  public config(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.conf.Config({
      zone: this.options.zone,
      ...config,
    });
  }

  public cdnManager() {
    return new qiniu.cdn.CdnManager(this.mac());
  }

  public putPolicy(options: qiniu.rs.PutPolicyOptions) {
    return new qiniu.rs.PutPolicy(options);
  }

  public formUploader(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.form_up.FormUploader({
      ...this.config(),
      config,
    });
  }

  public bucketManager(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.rs.BucketManager(this.mac(), {
      ...this.config(),
      config,
    });
  }

  public operationManager(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.fop.OperationManager(this.mac(), {
      ...this.config(),
      config,
    });
  }

  /**
   * 获取上传 token
   * @see https://developer.qiniu.com/kodo/1206/put-policy
   * @param options
   */
  public getUploadToken(options: qiniu.rs.PutPolicyOptions): string {
    return this.putPolicy(options).uploadToken(this.mac());
  }

  /**
   * 获取公开空间下载地址
   * @param key
   */
  public getPublicDownloadUrl(key: string): string {
    return this.bucketManager().publicDownloadUrl(this.getDomain(), key);
  }

  /**
   * 获取私有空间下载地址
   * @param key 文件路径
   * @param expires 过期时间 秒
   */
  public getPrivateDownloadUrl(key: string, expires: number): string {
    return this.bucketManager().privateDownloadUrl(this.getDomain(), key, expires);
  }

  /**
   * 校验是否为七牛回调内容
   * @param requestURI 回调的URL中的requestURI
   * @param callbackAuth 回调时请求的Authorization头部值
   * @param reqBody 回调的URL中的requestURI 请求Body，仅当请求的ContentType为application/x-www-form-urlencoded时才需要传入该参数
   */
  public getIsQiniuCallback(requestURI: string, callbackAuth: string, reqBody = null): boolean {
    return qiniu.util.isQiniuCallback(this.mac(), requestURI, reqBody, callbackAuth);
  }
}
