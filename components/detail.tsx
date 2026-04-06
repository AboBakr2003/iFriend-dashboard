export function Detail({ label, content }: { label: string; content: React.ReactNode; }) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-2 gap-x-4 text-nowrap">
      <span className="w-full text-sm text-natural-text font-medium">{label}</span>
      <span className="w-full text-sm font-semibold col-span-2">{content}</span>
    </div>
  );
}