# problem-response

An implementation of [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) for TypeScript, providing a `ProblemResponse` class for creating HTTP responses with problem details.

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

Also includes a factory builder for declaring problem types ahead of time, with schema validation and type inference:

```ts
// problems.ts
import * as v from "valibot";
import { defineProblems } from "problem-response";

const problems = defineProblems({
  OutOfCredit: {
    schema: v.object({
      type: v.literal("https://example.com/probs/out-of-credit"),
      title: v.literal("You do not have enough credit."),
      status: v.literal(403),
      detail: v.string(),
      instance: v.pipe(v.string(), v.toUpperCase()),
      accounts: v.array(v.string()),
    }),
    construct: (detail: string, instance: string, accounts: string[]) =>
      ({
        type: "https://example.com/probs/out-of-credit",
        title: "You do not have enough credit.",
        status: 403,
        detail,
        instance,
        accounts,
      }) as const,
  },
});

// app.ts
import { Hono } from "hono";
import { problems } from "./problems";
const app = new Hono();

app.get("/payments/:id", (c) => {
  return problems.OutOfCredit(
    "Your current balance is 30, but that costs 50.",
    "/account/12345/msgs/abc",
    ["/account/12345", "/account/67890"],
  );
});

export default app;
```
