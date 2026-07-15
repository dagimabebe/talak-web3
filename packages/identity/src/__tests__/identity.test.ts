import type { CeramicAdapter } from "@talak-web3/adapters";
import { describe, it, expect, vi } from "vitest";

import { IdentityService } from "../index.js";

describe("IdentityService", () => {
  describe("ensureCeramicProfile", () => {
    it("returns { id: 'disabled' } when no ceramic adapter is provided", async () => {
      const service = new IdentityService();
      const result = await service.ensureCeramicProfile({ did: "did:key:z123" });
      expect(result).toEqual({ id: "disabled" });
    });

    it("delegates to ceramic.createProfile when adapter is provided", async () => {
      const mockCreateProfile = vi.fn().mockResolvedValue({ id: "profile-abc" });
      const ceramic: CeramicAdapter = { createProfile: mockCreateProfile };

      const service = new IdentityService(ceramic);
      const result = await service.ensureCeramicProfile({ did: "did:key:z456" });

      expect(mockCreateProfile).toHaveBeenCalledWith({ did: "did:key:z456" });
      expect(result).toEqual({ id: "profile-abc" });
    });

    it("propagates errors from ceramic adapter", async () => {
      const mockCreateProfile = vi.fn().mockRejectedValue(new Error("Ceramic unavailable"));
      const ceramic: CeramicAdapter = { createProfile: mockCreateProfile };

      const service = new IdentityService(ceramic);

      await expect(service.ensureCeramicProfile({ did: "did:key:z789" })).rejects.toThrow(
        "Ceramic unavailable",
      );
    });
  });
});
