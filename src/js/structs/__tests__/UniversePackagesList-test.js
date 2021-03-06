const UniversePackage = require("../UniversePackage");
const UniversePackagesList = require("../UniversePackagesList");

let thisPackages, thisPackagesList;

describe("UniversePackagesList", function() {
  describe("#constructor", function() {
    it("creates instances of UniversePackage", function() {
      var items = [{ foo: "bar" }];
      var list = new UniversePackagesList({ items });
      items = list.getItems();
      expect(items[0] instanceof UniversePackage).toBeTruthy();
    });
  });

  describe("#filterItemsByText", function() {
    it("filters by name", function() {
      var items = [{ name: "foo" }, { name: "bar" }];
      var list = new UniversePackagesList({ items });
      items = list.filterItemsByText("bar").getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get("name")).toEqual("bar");
    });

    it("filters by description", function() {
      var items = [{ description: "foo" }, { description: "bar" }];
      var list = new UniversePackagesList({ items });
      items = list.filterItemsByText("foo").getItems();
      expect(items.length).toEqual(1);
      expect(items[0].get("description")).toEqual("foo");
    });

    it("filters by tags", function() {
      var items = [{ tags: ["foo", "bar"] }, { tags: ["foo"] }, { tags: [] }];
      var list = new UniversePackagesList({ items });
      items = list.filterItemsByText("foo").getItems();
      expect(items.length).toEqual(2);
      expect(items[0].get("tags")).toEqual(["foo", "bar"]);
      expect(items[1].get("tags")).toEqual(["foo"]);
    });

    it("handles filter by tags with null elements", function() {
      var items = [{ tags: ["foo", "bar"] }, { tags: ["foo"] }, { tags: null }];
      var list = new UniversePackagesList({ items });
      expect(list.filterItemsByText.bind(list, "foo")).not.toThrow();
    });
  });

  describe("#getSelectedAndNonSelectedPackages", function() {
    beforeEach(function() {
      thisPackages = [
        { name: "isSelected", selected: true },
        { name: "isNotSelected", selected: false },
        { name: "isNotSelected2", selected: false }
      ];
      thisPackagesList = new UniversePackagesList({ items: thisPackages });
    });

    it("returns the correct number of selected packages", function() {
      var result = thisPackagesList.getSelectedAndNonSelectedPackages();
      expect(result.selectedPackages.getItems().length).toEqual(1);
    });

    it("returns the correct number of non-selected packages", function() {
      var result = thisPackagesList.getSelectedAndNonSelectedPackages();
      expect(result.nonSelectedPackages.getItems().length).toEqual(2);
    });
  });
});
