import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { bullyingPercentages, bullyingReferences } from "./bullying-data";

describe("official bullying data", () => {
  test("preserves source percentages without normalizing them to 100", () => {
    deepStrictEqual(bullyingPercentages.map((item) => item.percentage), [
      13, 11.9, 4.9, 3.7, 3.3, 2.5, 2.5, 1.4,
    ]);
  });
  test("includes all five references requested by the user", () => {
    deepStrictEqual(bullyingReferences.map((source) => source.url), [
      "https://www.unesco.org",
      "https://www.unicef.org/brazil",
      "https://new.safernet.org.br",
      "https://www.cdc.gov/youth-violence/about/about-bullying.html",
      "https://www.stopbullying.gov",
    ]);
  });
});
