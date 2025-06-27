/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as airportTime from "../airportTime.js";
import type * as payment from "../payment.js";
import type * as support from "../support.js";
import type * as tasks from "../tasks.js";
import type * as transactions from "../transactions.js";
import type * as transportation from "../transportation.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  airportTime: typeof airportTime;
  payment: typeof payment;
  support: typeof support;
  tasks: typeof tasks;
  transactions: typeof transactions;
  transportation: typeof transportation;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
