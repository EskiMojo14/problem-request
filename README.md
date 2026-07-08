# problem-response

An implementation of [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) for TypeScript, providing a `ProblemResponse` (subclass of `Response`) for creating HTTP responses with problem details.

For example, with Hono:

```ts
import { Hono } from "hono";
import { ProblemResponse } from "problem-response";

const app = new Hono();

app.get("/payments/:id", (c) => {
  return ProblemResponse.problem({
    type: "https://example.com/probs/out-of-credit",
    title: "You do not have enough credit.",
    status: 403,
    instance: "/account/12345/msgs/abc",
    accounts: ["/account/12345", "/account/67890"],
  });
});

export default app;
```

Also includes a factory builder for declaring problem types ahead of time, with Standard Schema validation and type inference:

```ts
// problems.ts
import * as v from "valibot";
import { defineProblem } from "problem-response";

export const OutOfCredit = defineProblem(
  v.object({
    type: v.literal("https://example.com/probs/out-of-credit"),
    title: v.literal("You do not have enough credit."),
    status: v.literal(403),
    detail: v.string(),
    instance: v.pipe(v.string(), v.toUpperCase()),
    accounts: v.array(v.string()),
  }),
  (detail: string, instance: string, accounts: string[]) =>
    ({
      type: "https://example.com/probs/out-of-credit",
      title: "You do not have enough credit.",
      status: 403,
      detail,
      instance,
      accounts,
    } as const),
});

// can also customise ResponseInit, e.g. to add headers
export const CustomInitProblem = defineProblem(
  v.object({
    type: v.literal("https://example.com/probs/custom-init"),
    title: v.literal("Custom init problem"),
    status: v.literal(400),
    detail: v.string(),
  }),
  (detail: string) => [
    // problem
    {
      type: "https://example.com/probs/custom-init",
      title: "Custom init problem",
      status: 400,
      detail,
    } as const,
    // init (excluding status, which is set from the problem)
    {
      headers: {
        "X-Custom-Header": "Custom value",
      },
    }
  ],
);

// app.ts
import { Hono } from "hono";
import * as problems from "./problems";

const app = new Hono();

app.get("/payments/:id", (c) => {
  // constructs a Response instance with the problem details and status code
  return problems.OutOfCredit(
    "Your current balance is 30, but that costs 50.",
    "/account/12345/msgs/abc",
    ["/account/12345", "/account/67890"],
  );
});

export default app;
```
