// Roster + assignments client. Talks to Next.js API routes backed by Supabase.

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

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (data && (data.error as string)) || `Request failed (${res.status}).`;
    throw new Error(msg);
  }
  return data as T;
}

// ─── Roster ───
export async function getRoster(): Promise<Designer[]> {
  const res = await fetch("/api/roster", { cache: "no-store" });
  const { designers } = await jsonOrThrow<{ designers: Designer[] }>(res);
  return designers;
}

export async function addDesigner(name: string): Promise<Designer> {
  const res = await fetch("/api/roster", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const { designer } = await jsonOrThrow<{ designer: Designer }>(res);
  return designer;
}

export async function removeDesigner(id: string): Promise<void> {
  const res = await fetch(`/api/roster/${encodeURIComponent(id)}`, { method: "DELETE" });
  await jsonOrThrow(res);
}

// ─── Assignments ───
export async function getAssignments(): Promise<Assignment[]> {
  const res = await fetch("/api/sheet", { cache: "no-store" });
  const { assignments } = await jsonOrThrow<{ assignments: Assignment[] }>(res);
  return assignments;
}

export async function addAssignment(
  input: Omit<Assignment, "id" | "createdAt">,
): Promise<Assignment> {
  const res = await fetch("/api/sheet", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const { assignment } = await jsonOrThrow<{ assignment: Assignment }>(res);
  return assignment;
}

export async function removeAssignment(id: string): Promise<void> {
  const res = await fetch(`/api/sheet/${encodeURIComponent(id)}`, { method: "DELETE" });
  await jsonOrThrow(res);
}
