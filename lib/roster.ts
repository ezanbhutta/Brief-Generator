"use client";

// Browser-side roster and assignment store. Persists to localStorage.
// No backend — each browser has its own data.

export interface Designer {
  id: string;
  name: string;
}

export interface Assignment {
  id: string;
  brandName: string;
  industry: string;
  style: string;
  designerId: string;
  designerName: string;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // ISO datetime
}

const ROSTER_KEY = "bbg.roster";
const ASSIGNMENTS_KEY = "bbg.assignments";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Roster ───
export function getRoster(): Designer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ROSTER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (d) =>
        d && typeof d.id === "string" && typeof d.name === "string" && d.name.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function saveRoster(roster: Designer[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
}

export function addDesigner(name: string): Designer {
  const trimmed = name.trim();
  const designer: Designer = { id: makeId(), name: trimmed };
  const roster = getRoster();
  roster.push(designer);
  saveRoster(roster);
  return designer;
}

export function removeDesigner(id: string): void {
  const roster = getRoster().filter((d) => d.id !== id);
  saveRoster(roster);
}

// ─── Assignments ───
export function getAssignments(): Assignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ASSIGNMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveAssignments(assignments: Assignment[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

export function addAssignment(
  input: Omit<Assignment, "id" | "createdAt">,
): Assignment {
  const assignment: Assignment = {
    ...input,
    id: makeId(),
    createdAt: new Date().toISOString(),
  };
  const assignments = getAssignments();
  assignments.push(assignment);
  saveAssignments(assignments);
  return assignment;
}

export function removeAssignment(id: string): void {
  const assignments = getAssignments().filter((a) => a.id !== id);
  saveAssignments(assignments);
}
