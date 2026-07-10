type RequestInfo = ConstructorParameters<typeof Request>[0];

export type MethodFactory = (
  input: RequestInfo,
  init?: Omit<RequestInit, "method">,
) => FetchableRequest;
export interface BodyMethodFactory extends MethodFactory {
  /**
   * Creates a new `FetchableRequest` instance with the specified JSON body and Content-Type header set to `application/json`.
   * If the `Content-Type` header is already present in the provided `init` object, it will not be overridden.
   * Uses the specified HTTP method for the request.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param body - The JSON body to be sent with the request.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  json: (input: RequestInfo, body: any, init?: Omit<RequestInit, "method">) => FetchableRequest;
  /**
   * Creates a new `FetchableRequest` instance with the specified FormData body.
   * Uses the specified HTTP method for the request.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param body - The FormData body to be sent with the request.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  formData: (
    input: RequestInfo,
    body: FormData,
    init?: Omit<RequestInit, "method">,
  ) => FetchableRequest;
}

// #__NO_SIDE_EFFECTS__
function createMethod(method: string): MethodFactory {
  return function (input: RequestInfo, init?: Omit<RequestInit, "method">) {
    return new FetchableRequest(input, {
      ...init,
      method,
    });
  };
}

// #__NO_SIDE_EFFECTS__
function createBodyMethod(method: string): BodyMethodFactory {
  const factory = createMethod(method);
  return Object.assign(factory, {
    json(input: RequestInfo, body: any, init?: Omit<RequestInit, "method">) {
      const headers = new Headers(init?.headers);
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      return factory(input, {
        ...init,
        body: JSON.stringify(body),
        headers,
      });
    },
    formData(input: RequestInfo, body: FormData, init?: Omit<RequestInit, "method">) {
      return factory(input, {
        ...init,
        body,
      });
    },
  });
}

/**
 * A Request subclass that can be used as a Promise, allowing you to use `await` directly on it.
 */
export class FetchableRequest extends Request implements PromiseLike<Response> {
  /**
   * Fetches the request and returns a Promise that resolves to the Response.
   * This allows you to use `await` directly on the FetchableRequest instance.
   *
   * @param init - Optional RequestInit object to customize the request.
   * @returns A Promise that resolves to the Response of the fetch operation.
   */
  fetch(init?: RequestInit): Promise<Response> {
    return fetch(this, init);
  }
  // oxlint-disable-next-line unicorn/no-thenable
  then<TResult1 = Response, TResult2 = never>(
    onfulfilled?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.fetch().then(onfulfilled, onrejected);
  }
  /**
   * Creates a new `FetchableRequest` instance with the specified JSON body and Content-Type header set to `application/json`.
   * If the `Content-Type` header is already present in the provided `init` object, it will not be overridden.
   *
   * @remarks Defaults method to POST if not specified in `init`.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param body - The JSON body to be sent with the request.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static json(input: RequestInfo, body: any, init?: RequestInit): FetchableRequest {
    const headers = new Headers(init?.headers);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return new FetchableRequest(input, {
      ...init,
      method: init?.method ?? "POST",
      body: JSON.stringify(body),
      headers,
    });
  }
  /**
   * Creates a new `FetchableRequest` instance with the specified FormData body.
   *
   * @remarks Defaults method to POST if not specified in `init`.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param body - The FormData body to be sent with the request.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static formData(input: RequestInfo, body: FormData, init?: RequestInit): FetchableRequest {
    return new FetchableRequest(input, {
      ...init,
      method: init?.method ?? "POST",
      body,
    });
  }
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to GET.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static get = createMethod("GET");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to HEAD.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static head = createMethod("HEAD");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to POST.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static post = createBodyMethod("POST");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to PUT.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static put = createBodyMethod("PUT");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to PATCH.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static patch = createBodyMethod("PATCH");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to DELETE.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static delete = createMethod("DELETE");
  /**
   * Creates a new `FetchableRequest` instance with the HTTP method set to QUERY.
   *
   * @param input - The input for the request, typically a URL or another Request object.
   * @param init - Optional RequestInit object to customize the request.
   * @returns A new `FetchableRequest` instance.
   */
  static query = createBodyMethod("QUERY");
}
