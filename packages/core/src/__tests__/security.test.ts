import {
  InMemoryNonceStore,
  InMemoryRefreshStore,
  InMemoryRevocationStore,
} from "@talak-web3/auth";
import { describe, it, expect } from "vitest";

import { talakWeb3 } from "../index";

describe("talakWeb3 security", () => {
  it("should throw error if private key is leaked in config", () => {
    const leakedConfig = {
      apiKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    };

    expect(() => talakWeb3(leakedConfig)).toThrow("Potential private key leak detected in config");
  });

  it("should allow valid addresses", () => {
    const validConfig = {
      chains: [
        {
          id: 1,
          name: "Mainnet",
          rpcUrls: ["https://mainnet.infura.io/v3/demo-project-id"],
          nativeCurrency: { name: "Ether", symbol: "ETH" },
        },
      ],
      auth: {
        nonceStore: new InMemoryNonceStore(),
        refreshStore: new InMemoryRefreshStore(),
        revocationStore: new InMemoryRevocationStore(),
      },
    };

    expect(() => talakWeb3(validConfig)).not.toThrow();
  });
});
