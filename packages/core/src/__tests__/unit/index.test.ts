import {
  InMemoryNonceStore,
  InMemoryRefreshStore,
  InMemoryRevocationStore,
} from "@talak-web3/auth";
import { describe, it, expect } from "vitest";

import { talakWeb3 } from "../../index.js";

const stores = () => ({
  nonceStore: new InMemoryNonceStore(),
  refreshStore: new InMemoryRefreshStore(),
  revocationStore: new InMemoryRevocationStore(),
});

const makeInstance = (extra: Record<string, unknown> = {}) =>
  talakWeb3({
    chains: [{ id: 1, rpcUrls: ["https://ethereum.rpc"] }],
    auth: stores(),
    ...extra,
  });

describe("talakWeb3", () => {
  describe("singleton behavior", () => {
    it("should return a new instance on each call", () => {
      const instance1 = makeInstance();
      const instance2 = makeInstance();
      expect(instance1).not.toBe(instance2);
    });

    it("should create independent instances", () => {
      const instance1 = makeInstance();
      const instance2 = makeInstance();
      expect(instance1.config).not.toBe(instance2.config);
    });
  });

  describe("instance structure", () => {
    it("should have required properties", () => {
      const instance = makeInstance();

      expect(instance).toHaveProperty("config");
      expect(instance).toHaveProperty("hooks");
      expect(instance).toHaveProperty("context");
      expect(instance).toHaveProperty("init");
      expect(instance).toHaveProperty("destroy");
    });

    it("should have init method", () => {
      const instance = makeInstance();

      expect(typeof instance.init).toBe("function");
    });

    it("should have destroy method", () => {
      const instance = makeInstance();

      expect(typeof instance.destroy).toBe("function");
    });
  });

  describe("initialization", () => {
    it("should initialize without plugins", async () => {
      const instance = makeInstance();

      await expect(instance.init()).resolves.not.toThrow();
    });

    it("should initialize with empty plugins array", async () => {
      const instance = makeInstance({ plugins: [] });

      await expect(instance.init()).resolves.not.toThrow();
    });
  });

  describe("destroy", () => {
    it("should destroy cleanly", async () => {
      const instance = makeInstance();

      await instance.init();
      await expect(instance.destroy()).resolves.not.toThrow();
    });

    it("should allow a new instance after destroy", async () => {
      const instance = makeInstance();
      await instance.init();
      await instance.destroy();
      const newInstance = makeInstance();
      expect(newInstance).not.toBe(instance);
    });
  });

  describe("context", () => {
    it("should have context with required properties", () => {
      const instance = makeInstance();

      expect(instance.context).toHaveProperty("config");
      expect(instance.context).toHaveProperty("hooks");
      expect(instance.context).toHaveProperty("plugins");
      expect(instance.context).toHaveProperty("auth");
      expect(instance.context).toHaveProperty("cache");
      expect(instance.context).toHaveProperty("logger");
      expect(instance.context).toHaveProperty("requestChain");
      expect(instance.context).toHaveProperty("responseChain");
      expect(instance.context).toHaveProperty("rpc");
    });
  });

  describe("hooks", () => {
    it("should have event emitter methods", () => {
      const instance = makeInstance();

      expect(typeof instance.hooks.on).toBe("function");
      expect(typeof instance.hooks.emit).toBe("function");
      expect(typeof instance.hooks.off).toBe("function");
      expect(typeof instance.hooks.clear).toBe("function");
    });
  });
});
