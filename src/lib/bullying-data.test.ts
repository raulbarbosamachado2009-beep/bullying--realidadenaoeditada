import { describe, expect, test } from "bun:test";
import { bullyingPercentages, bullyingReferences } from "./bullying-data";

describe("official bullying data", () => {
  test("preserves source percentages without normalizing them to 100", () => {
    expect(bullyingPercentages.map((item) => item.percentage)).toEqual([13, 11.9, 4.9, 3.7, 3.3, 2.5, 2.5, 1.4]);
  });
  test("includes all five references requested by the user", () => {
    expect(bullyingReferences.map((source) => source.url)).toEqual([
      "https://www.unesco.org", "https://www.unicef.org/brazil", "https://new.safernet.org.br",
      "https://www.cdc.gov/youth-violence/about/about-bullying.html", "https://www.stopbullying.gov",
    ]);
  });
});