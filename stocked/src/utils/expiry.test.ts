import {describe, expect, it} from "vitest";
import { expiryStatus, ExpiryStatus } from "./expiry";

describe("expiryStatus", () => {
    it("returnerer expired for en gammel dato", () => {
        expect(expiryStatus("2020-01-01")).toBe("expired");
    });
});