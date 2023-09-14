// 参考文献：https://blog.dqv5.com/2021/04/04/tampermonkey-request-intercept/
export interface RequestInterceptor {
  when?: (element: XMLHttpRequest) => boolean;
  onload?: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void;
}

export interface XMLHttpRequestWithParams extends XMLHttpRequest {
  openParams: Array<string>;
}

export const URLIndex = 1;

export interface Response<T> {
  code: number,
  data: T,
}

export class Interceptor {
  private static instance: Interceptor = new Interceptor();
  private interceptors: Array<RequestInterceptor> = [];

  private constructor() {
    const interceptors = this.interceptors;
    /**
     * 重写send方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
     */
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      interceptors.forEach((interceptor) => {
        if ((!interceptor.when || interceptor.when(this)) && interceptor.onload) {
          this.onload = interceptor.onload.bind(this);
        }
      });
      originalSend.bind(this)(body);
    };
  }

  public static get INSTANCE(): Interceptor {
    return Interceptor.instance;
  }

  public register(interceptor: RequestInterceptor) {
    this.interceptors.push(interceptor);
  }
}
