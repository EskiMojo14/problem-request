import * as v from "valibot";

export const outOfCreditType = "https://example.com/probs/out-of-credit" as const;
export const outOfCreditSchema = v.object({
  title: v.literal("You do not have enough credit."),
  status: v.literal(403),
  detail: v.string(),
  instance: v.pipe(v.string(), v.toUpperCase()), // include a transform, to check it's used
  accounts: v.array(v.string()),
});
export type OutOfCreditProblem = v.InferInput<typeof outOfCreditSchema>;
export const outOfCreditProblem = {
  title: "You do not have enough credit.",
  status: 403,
  detail: "Your account balance is insufficient.",
  instance: "/account/12345/transactions",
  accounts: ["account1", "account2"],
} satisfies OutOfCreditProblem;

export const iAmATeapotType = "https://example.com/probs/i-am-a-teapot" as const;
export const iAmATeapotSchema = v.object({
  title: v.literal("I'm a teapot"),
  status: v.literal(418),
});
export type IAmATeapotProblem = v.InferInput<typeof iAmATeapotSchema>;

export const validProblemDetails = {
  type: "https://example.com/probs/out-of-credit",
  title: "You do not have enough credit.",
  detail: "Your current balance is 30, but that costs 50.",
  instance: "/account/12345/msgs/abc",
  status: 403,
};
export const invalidProblemDetails = {
  type: 123, // should be string
  title: "You do not have enough credit.",
  detail: "Your current balance is 30, but that costs 50.",
  instance: "/account/12345/msgs/abc",
  status: "403", // should be number
};
