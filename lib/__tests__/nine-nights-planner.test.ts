import {
  calculateTotalButtons,
  mergeGoalSelections,
  plannerStateFromSearchParams,
  plannerStateToSearchParams,
  removeGoalSelections,
  sanitizePlannerState,
  toggleGoalSelection,
  type NineNightsGoal,
} from "../nine-nights-planner";

const goals: NineNightsGoal[] = [
  {
    id: "full-shop",
    name: "Full Shop",
    nameEn: "Full Shop",
    category: "completion",
    buttonCost: 1000,
    sourceTier: "secondary",
    sourceLabel: "test",
  },
  {
    id: "skin-a",
    name: "Skin A",
    nameEn: "Skin A",
    category: "cosmetic",
    buttonCost: 200,
    sourceTier: "secondary",
    sourceLabel: "test",
  },
  {
    id: "skin-b",
    name: "Skin B",
    nameEn: "Skin B",
    category: "cosmetic",
    buttonCost: 300,
    sourceTier: "secondary",
    sourceLabel: "test",
  },
];

describe("nine-nights-planner helpers", () => {
  it("keeps full-shop mutually exclusive", () => {
    expect(toggleGoalSelection(["skin-a"], "full-shop")).toEqual(["full-shop"]);
    expect(toggleGoalSelection(["full-shop"], "skin-a")).toEqual(["skin-a"]);
  });

  it("calculates totals with custom target when full-shop is not selected", () => {
    const total = calculateTotalButtons(goals, {
      selectedIds: ["skin-a", "skin-b"],
      ownedButtons: 0,
      targetDays: 7,
      customTarget: 50,
      includeCustomTarget: true,
    });
    expect(total).toBe(550);
  });

  it("prioritizes full-shop total over custom data", () => {
    const total = calculateTotalButtons(goals, {
      selectedIds: ["full-shop", "skin-a"],
      ownedButtons: 0,
      targetDays: 7,
      customTarget: 999,
      includeCustomTarget: true,
    });
    expect(total).toBe(1000);
  });

  it("round-trips planner state through URL search params", () => {
    const original = {
      selectedIds: ["skin-a", "skin-b"],
      ownedButtons: 123,
      targetDays: 3,
      customTarget: 88,
      includeCustomTarget: true,
    };
    const params = plannerStateToSearchParams(original);
    const parsed = plannerStateFromSearchParams(params, goals.map((goal) => goal.id));
    expect(parsed).toEqual(original);
  });

  it("sanitizes invalid values", () => {
    expect(
      sanitizePlannerState({
        selectedIds: ["skin-a", "", "skin-a"],
        ownedButtons: -5,
        targetDays: 0,
        customTarget: -10,
        includeCustomTarget: 1 as unknown as boolean,
      })
    ).toEqual({
      selectedIds: ["skin-a"],
      ownedButtons: 0,
      targetDays: 7,
      customTarget: 0,
      includeCustomTarget: true,
    });
  });

  it("merges visible selections while keeping full-shop exclusive", () => {
    expect(mergeGoalSelections(["skin-a"], ["skin-b"])).toEqual(["skin-a", "skin-b"]);
    expect(mergeGoalSelections(["skin-a"], ["full-shop"])).toEqual(["full-shop"]);
  });

  it("removes a batch of goals cleanly", () => {
    expect(removeGoalSelections(["full-shop", "skin-a", "skin-b"], ["skin-a", "skin-b"])).toEqual(["full-shop"]);
  });
});
