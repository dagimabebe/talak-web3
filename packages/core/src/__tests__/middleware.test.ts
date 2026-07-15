import {
  InMemoryNonceStore,
  InMemoryRefreshStore,
  InMemoryRevocationStore,
} from "@talak-web3/auth";
import type { MiddlewareHandler } from "@talak-web3/types";
import { describe, it, expect } from "vitest";

import { talakWeb3 } from "../index";

describe("talakWeb3 middleware", () => {
  it("should execute request middleware chain", async () => {
    const instance = talakWeb3({
      auth: {
        nonceStore: new InMemoryNonceStore(),
        refreshStore: new InMemoryRefreshStore(),
        revocationStore: new InMemoryRevocationStore(),
      },
    });
    const order: string[] = [];

    const m1: MiddlewareHandler = async (req, next) => {
      order.push("m1-start");
      const res = await next();
      order.push("m1-end");
      return res;
    };

    const m2: MiddlewareHandler = async (req, next) => {
      order.push("m2-start");
      const res = await next();
      order.push("m2-end");
      return res;
    };

    instance.context.requestChain.use(m1);
    instance.context.requestChain.use(m2);

    const finalHandler = async () => {
      order.push("final");
      return { success: true };
    };

    const result = await instance.context.requestChain.execute(
      { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] },
      instance.context,
      finalHandler,
    );

    expect(result).toEqual({ success: true });
    expect(order).toEqual(["m1-start", "m2-start", "final", "m2-end", "m1-end"]);
  });
});
