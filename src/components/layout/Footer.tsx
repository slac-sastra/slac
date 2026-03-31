import { useStore } from "@/hooks/use-store";
import { translations } from "@/lib/translations";
import { AlertCircle, Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <footer className="mt-auto border-t border-border bg-white no-print">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-accent/10 border border-accent/20 text-accent-foreground max-w-2xl">
            <AlertCircle className="w-6 h-6 text-accent shrink-0" />
            <p className="text-sm font-medium text-foreground">
              {t.disclaimer}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Shield className="w-4 h-4" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
