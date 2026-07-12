export type GoalCategory = "completion" | "cosmetic";
export type GoalSourceTier = "official" | "secondary";

export interface NineNightsGoal {
  id: string;
  name: string;
  nameTw?: string;
  nameEn: string;
  category: GoalCategory;
  buttonCost: number;
  sourceTier: GoalSourceTier;
  sourceLabel: string;
  sourceUrl?: string;
  exclusiveGroup?: string;
  note?: string;
  noteTw?: string;
  noteEn?: string;
}

export interface PlannerState {
  selectedIds: string[];
  ownedButtons: number;
  targetDays: number;
  customTarget: number;
  includeCustomTarget: boolean;
}

type PlannerStateInput = {
  selectedIds?: string[];
  ownedButtons?: number | string | null;
  targetDays?: number | string | null;
  customTarget?: number | string | null;
  includeCustomTarget?: boolean;
};

export const PLANNER_STORAGE_KEY = "nte-999-nights-planner";

export function ceilDiv(a: number, b: number): number {
  if (b <= 0) return 0;
  return Math.ceil(a / b);
}

export function sanitizePlannerState(input: PlannerStateInput): PlannerState {
  return {
    selectedIds: Array.isArray(input.selectedIds) ? Array.from(new Set(input.selectedIds.filter(Boolean))) : [],
    ownedButtons: Math.max(0, Number(input.ownedButtons) || 0),
    targetDays: Math.max(1, Number(input.targetDays) || 7),
    customTarget: Math.max(0, Number(input.customTarget) || 0),
    includeCustomTarget: Boolean(input.includeCustomTarget),
  };
}

export function toggleGoalSelection(selectedIds: string[], goalId: string): string[] {
  if (goalId === "full-shop") {
    return selectedIds.includes(goalId) ? [] : ["full-shop"];
  }

  const next = selectedIds.filter((id) => id !== "full-shop");
  return next.includes(goalId) ? next.filter((id) => id !== goalId) : [...next, goalId];
}

export function mergeGoalSelections(selectedIds: string[], goalIds: string[]): string[] {
  const sanitizedIncoming = Array.from(new Set(goalIds.filter(Boolean)));
  if (sanitizedIncoming.includes("full-shop")) {
    return ["full-shop"];
  }

  const base = selectedIds.filter((id) => id !== "full-shop");
  return Array.from(new Set([...base, ...sanitizedIncoming]));
}

export function removeGoalSelections(selectedIds: string[], goalIds: string[]): string[] {
  const toRemove = new Set(goalIds);
  return selectedIds.filter((id) => !toRemove.has(id));
}

export function calculateTotalButtons(goals: NineNightsGoal[], state: PlannerState): number {
  if (state.selectedIds.includes("full-shop")) {
    return goals.find((goal) => goal.id === "full-shop")?.buttonCost || 0;
  }

  const selectedSet = new Set(state.selectedIds);
  const selectedTotal = goals
    .filter((goal) => selectedSet.has(goal.id))
    .reduce((sum, goal) => sum + goal.buttonCost, 0);

  return selectedTotal + (state.includeCustomTarget ? state.customTarget : 0);
}

export function plannerStateToSearchParams(state: PlannerState): URLSearchParams {
  const sanitized = sanitizePlannerState(state);
  const params = new URLSearchParams();

  if (sanitized.selectedIds.length > 0) {
    params.set("goals", sanitized.selectedIds.join(","));
  }
  if (sanitized.ownedButtons > 0) {
    params.set("owned", String(sanitized.ownedButtons));
  }
  if (sanitized.targetDays !== 7) {
    params.set("days", String(sanitized.targetDays));
  }
  if (sanitized.includeCustomTarget && sanitized.customTarget > 0) {
    params.set("custom", String(sanitized.customTarget));
  }

  return params;
}

export function plannerStateFromSearchParams(
  params: URLSearchParams,
  validGoalIds: string[]
): PlannerState {
  const selectedIds = (params.get("goals") || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => validGoalIds.includes(item));

  const state = sanitizePlannerState({
    selectedIds,
    ownedButtons: params.get("owned"),
    targetDays: params.get("days"),
    customTarget: params.get("custom"),
    includeCustomTarget: params.has("custom") && Number(params.get("custom") || 0) > 0,
  });

  if (state.selectedIds.includes("full-shop")) {
    state.selectedIds = ["full-shop"];
    state.includeCustomTarget = false;
    state.customTarget = 0;
  }

  return state;
}
