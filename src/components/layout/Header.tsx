import { useStore } from "@/hooks/use-store";
import { translations } from "@/lib/translations";
import { Scale, Globe } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { language, toggleLanguage } = useStore();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 glass-panel">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-lg leading-tight text-foreground tracking-tight">
              {t.appTitle}
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Legal Aid Clinic</span>
          </div>
        </Link>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground font-medium text-sm transition-all"
        >
          <Globe className="w-4 h-4 text-primary" />
          <span className={language === 'ta' ? 'font-sans' : 'font-tamil'}>
            {t.toggleLangText}
          </span>
        </button>
      </div>
    </header>
  );
}
