import type { LooseProblemDetails } from "./types.ts";

export class ProblemResponse extends Response {
  static problem(
    problem: LooseProblemDetails,
    init?: Omit<ResponseInit, "status">,
  ): ProblemResponse {
    const { status = 500 } = problem;
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/problem+json");
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

export type { ProblemDetails, LooseProblemDetails } from "./types.ts";
export { problemDetailsSchema } from "./standard.ts";
