// CSV export helpers — used by every page's Export button.

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  const clean = s.replace(/"/g, '""');
  return /[",\n]/.test(clean) ? `"${clean}"` : clean;
}

function download(filename: string, text: string) {
  const blob = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Export rows as CSV. cols = [key, header label] pairs. */
export function exportCsv(filename: string, rows: object[], cols: [string, string][]) {
  const header = cols.map(([, label]) => cell(label)).join(",");
  const lines = rows.map((row) =>
    cols.map(([key]) => cell((row as Record<string, unknown>)[key])).join(","),
  );
  download(filename, [header, ...lines].join("\n"));
}

/** Export multiple titled tables into one CSV file (report dossiers). */
export function exportSections(
  filename: string,
  sections: { title: string; rows: object[]; cols: [string, string][] }[],
) {
  const parts: string[] = [];
  for (const s of sections) {
    parts.push(cell(s.title));
    parts.push(s.cols.map(([, label]) => cell(label)).join(","));
    for (const row of s.rows) {
      parts.push(s.cols.map(([key]) => cell((row as Record<string, unknown>)[key])).join(","));
    }
    parts.push("");
  }
  download(filename, parts.join("\n"));
}
