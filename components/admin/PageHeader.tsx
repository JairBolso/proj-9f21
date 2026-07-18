export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="font-mono font-bold text-[26px] uppercase tracking-[-.01em] text-admin-text">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[14px] text-admin-textMuted">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
