

type DashboardIslandProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function DashboardIsland({
  children,
  className = "",
}: DashboardIslandProps) {
  return (
    <section
      className={`rounded-[20px] w-full bg-white p-5 sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}
