export function statusTone(status: string | null | undefined) {
  if (status === "running" || status === "active" || status === "available") {
    return "success";
  }

  if (status === "failed" || status === "error" || status === "stopped") {
    return "danger";
  }

  if (status === "creating" || status === "pending" || status === "deploying") {
    return "warning";
  }

  return "neutral";
}

export function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="wrap-break-word text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}
