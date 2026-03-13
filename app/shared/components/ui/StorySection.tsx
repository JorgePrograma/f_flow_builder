import { UI_TOKENS } from "../../../shared/theme/ui-tokens";

interface AtomProps {
  children: React.ReactNode;
  className?: string;
  icon?: string;
  title: string;
  headerAction?: React.ReactNode;
}

export const StorySection = ({ children, icon, title, headerAction, className = "" }: AtomProps) => (
  <section className={`${UI_TOKENS.container} ${className}`}>
    <div className={UI_TOKENS.containerHeader}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className={UI_TOKENS.sectionTitle}>{title}</h3>
      </div>
      {headerAction}
    </div>
    <div className={UI_TOKENS.containerBody}>
      {children}
    </div>
  </section>
);
