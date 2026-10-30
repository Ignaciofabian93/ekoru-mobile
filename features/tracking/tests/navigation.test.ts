import { recordScreen, sourceOf, viewSourceFor } from "../navigation";

describe("sourceOf", () => {
  it.each([
    [null, "EXTERNAL"],
    [["(tabs)"], "HOME"],
    [["(tabs)", "index"], "HOME"],
    [["(tabs)", "profile"], "OTHER"],
    [["(search)"], "SEARCH"],
    [["(stores)", "store-category"], "CATALOG"],
    [["(marketplace)", "product-category"], "CATALOG"],
    [["seller", "[id]"], "SELLER"],
    [["product", "[id]"], "ITEM"],
  ] as const)("%j is %s", (segments, source) => {
    expect(sourceOf(segments)).toBe(source);
  });
});

describe("viewSourceFor", () => {
  it("names the screen before the item, whether or not the tracker caught up", () => {
    recordScreen({ path: "/", segments: ["(tabs)"] });
    recordScreen({ path: "/(search)", segments: ["(search)"] });

    // The item screen asks before the tracker has recorded it…
    expect(viewSourceFor("/product/7")).toBe("SEARCH");
    // …and after.
    recordScreen({ path: "/product/7", segments: ["product", "[id]"] });
    expect(viewSourceFor("/product/7")).toBe("SEARCH");

    // From one product to another.
    expect(viewSourceFor("/product/8")).toBe("ITEM");
  });
});
