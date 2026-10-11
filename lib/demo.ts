import records from "@/content/demo/records.json";
export const demoRecords = records;
export function validateRecords(rows = records) {
  const seen = new Set<string>();
  return rows.map((row) => {
    const issue = seen.has(row.id)
      ? "Duplicate ID"
      : row.value === null
        ? "Missing value"
        : row.value < 0
          ? "Negative value"
          : !["North", "South", "West"].includes(row.region)
            ? "Unknown region"
            : null;
    seen.add(row.id);
    return { ...row, issue };
  });
}
export const checkedRecords = validateRecords();
export const validRecords = checkedRecords.filter((r) => !r.issue);
export const regionCounts = ["North", "South", "West"].map((region) => ({
  region,
  count: validRecords.filter((r) => r.region === region).length,
}));
export const storySteps = [
  {
    id: "collect",
    title: "Collect",
    subtitle: "Start with the records and the question.",
    body: "Bring the inputs into view. In this synthetic example, 24 records arrive with a region and a value. A clear question comes before a chart.",
    note: "24 sample records · 3 expected regions",
  },
  {
    id: "validate",
    title: "Validate",
    subtitle: "Trust starts with a closer look.",
    body: "Check completeness, consistency and quality. Separate missing values, duplicate IDs, negative values and unknown regions for review.",
    note: "4 flagged records · 20 valid records",
  },
  {
    id: "analyze",
    title: "Analyze",
    subtitle: "Make the pattern readable.",
    body: "Group the valid records by region. A simple chart makes the distribution visible without hiding the denominator or the records behind it.",
    note: "North 7 · South 6 · West 7",
  },
  {
    id: "automate",
    title: "Automate",
    subtitle: "Make good work repeatable.",
    body: "Connect input, validation, human review and reporting. Keep exceptions visible so a repeatable workflow supports informed decisions.",
    note: "Input → Check → Review → Report",
  },
] as const;
