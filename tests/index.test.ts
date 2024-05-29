import { describe, test, expect } from "vitest";

import tebex, {
    checkout,
    events,
    version
} from "../src/index";

describe("Exports", () => {

    test("Exports Tebex object as the default", () => {
        expect(tebex).toBeTypeOf("object");
        expect(tebex).toHaveProperty("version");
        expect(tebex).toHaveProperty("events");
        expect(tebex).toHaveProperty("checkout");
    });

    test("Named exports match Tebex object members:", () => {
        expect(tebex.version).toBe(version);
        expect(tebex.events).toBe(events);
        expect(tebex.checkout).toBe(checkout);
    });

});