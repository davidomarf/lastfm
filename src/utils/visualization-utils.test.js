const utils = require("./visualization-utils");

describe("Visualization utils", () => {
  describe("getIDFromDate ()", () => {
    it("should set a default prefix", () => {
      expect(utils.getIDFromDate(new Date(2000, 5, 10))).toBe("id-2000-6-10");
    });

    it("should use a sent prefix", () => {
      expect(utils.getIDFromDate(new Date(1998, 10, 10), "date")).toBe(
        "date-1998-11-10"
      );
    });

    it("should fail with non-date objects", () => {
      expect(() => utils.getIDFromDate("date", "pre")).toThrow();
    });
  });

  describe("getDateArray ()", () => {
    it("should have n+1 dates in the array when dates are n days apart", () => {
      expect(
        utils.getDateArray(
          new Date(),
          new Date(new Date().setDate(new Date().getDate() + 10))
        )
      ).toHaveLength(11);
    });

    it("should return one date if dates are the same", () => {
      expect(utils.getDateArray(new Date(), new Date())).toHaveLength(1);
    });

    it("should throw when start is bigger than end", () => {
      expect(() =>
        utils.getDateArray(
          new Date(new Date().setDate(new Date().getDate() + 10)),
          new Date()
        )
      ).toThrow();
    });
  });
});
