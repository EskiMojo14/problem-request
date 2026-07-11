import type { LooseProblemDetails } from "./types/index.ts";

/**
 * A Response subclass that represents a problem details response as defined in RFC 7807.
 * It provides a static method to create a problem response with the appropriate status code and Content-Type header.
 */
export class ProblemResponse extends Response {
  /**
   * Creates a new `ProblemResponse` instance with the specified problem details and optional response initialization options.
   * The `Content-Type` header is set to `application/problem+json` if not already present in the provided `init` object.
   *
   * @param problem - The problem details object conforming to RFC 7807.
   * @param init - Optional ResponseInit object to customize the response.
   * @returns A new `ProblemResponse` instance.
   */
  static problem(
    problem: LooseProblemDetails,
    init?: Omit<ResponseInit, "status">,
  ): ProblemResponse {
    const { status = 500 } = problem;
    const headers = new Headers(init?.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/problem+json");
    }
    return Object.setPrototypeOf(
      Response.json(problem, {
        ...init,
        status,
        headers,
      }),
      ProblemResponse.prototype,
    );
  }
}
