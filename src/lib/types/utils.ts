// oxlint-disable-next-line typescript/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type PickPartial<T, K extends keyof T> = Compute<Partial<Pick<T, K>> & Omit<T, K>>;

export type Override<T, U> = Compute<Omit<T, keyof U> & U>;

export type KeyofUnion<T> = T extends T ? keyof T : never;
export type OneOf<
  Union extends object,
  // stored here to avoid distribution - don't provide this parameter yourself
  AllKeys extends KeyofUnion<Union> = KeyofUnion<Union>,
> = Union extends infer Item
  ? Compute<Item & { [K in Exclude<AllKeys, keyof Item>]?: never }>
  : never;

export type NonReducibleUnknown = {} | null | undefined;
export namespace LooseAutocomplete {
  export type Unknown<T> = T | NonReducibleUnknown;
  export type String<T extends string> = T | (string & {});
}
