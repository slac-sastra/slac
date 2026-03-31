"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LogOut,
  Search,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Shield,
  Loader2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { useStore } from "@/hooks/use-store";
import { translations } from "@/lib/translations";
import { adminLogin, getCases, CasesResponse, CaseResult } from "@/lib/api";
import { useDownloadPdf, useDownloadCsv } from "@/hooks/use-downloads";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function useAdminGetCases(
  params: { password: string; search?: string },
  options?: any
) {
  return useQuery<CasesResponse>({
    queryKey: ['admin-cases', params.search],
    queryFn: () => getCases(params.password, params.search),
    enabled: !!params.password && (options?.query?.enabled !== false),
    retry: options?.query?.retry ?? false,
  });
}

function AdminLoginComponent() {
  const [password, setPassword] = useState("");
  const { setAdminPassword, language } = useStore();
  const t = translations[language as "ta" | "en"] || translations.ta;
  const { toast } = useToast();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (pwd: string) => adminLogin(pwd),
    onSuccess: (data, variables) => {
      if (data.success) {
        setAdminPassword(variables);
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid password",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid credentials or server error",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    login(password);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-8 bg-primary text-primary-foreground rounded-t-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-display text-white">{t.adminLogin}</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Secure area for SASTRA Clinic staff
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-14 text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg" disabled={isPending || !password}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t.login}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboardComponent() {
  const { adminPassword, setAdminPassword, language } = useStore();
  const t = translations[language as "ta" | "en"] || translations.ta;
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useAdminGetCases(
    { password: adminPassword || "", search: debouncedSearch },
    {
      query: {
        enabled: !!adminPassword,
        retry: false,
      },
    }
  );

  // Handle auth errors
  useEffect(() => {
    if (isError && (error as any)?.status === 401) {
      setAdminPassword(null);
      toast({ title: "Session Expired", description: "Please login again", variant: "destructive" });
    }
  }, [isError, error, setAdminPassword, toast]);

  const { mutate: downloadPdf, isPending: isDownloadingPdf } = useDownloadPdf();
  const { mutate: downloadCsv, isPending: isDownloadingCsv } = useDownloadCsv();

  const handleLogout = () => {
    setAdminPassword(null);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent" />
            <h1 className="font-display font-bold text-xl tracking-tight">SASTRA Admin Portal</h1>
          </div>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> {t.logout}
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Cases Directory</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Showing {data?.cases.length || 0} of {data?.total || 0} total records
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.search}
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="bg-white shrink-0"
              onClick={() => {
                if (adminPassword) downloadCsv(adminPassword);
              }}
              disabled={isDownloadingCsv || !data?.cases.length}
            >
              {isDownloadingCsv ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              {t.exportCsv}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !data || data.cases.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">{t.noCases}</h3>
            <p className="text-muted-foreground text-sm">No legal aid requests found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.cases.map((caseItem: CaseResult) => (
              <Card key={caseItem.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                {/* Compact Row */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedRow(expandedRow === caseItem.id ? null : caseItem.id)}
                >
                  <div className="flex items-center gap-6 flex-1 w-full sm:w-auto">
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                      <span className="text-xs font-bold uppercase">{format(new Date(caseItem.createdAt), "MMM")}</span>
                      <span className="text-xl font-bold leading-none">{format(new Date(caseItem.createdAt), "dd")}</span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-lg">{caseItem.name}</h4>
                        <Badge variant="secondary" className="text-xs">Age {caseItem.age}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {caseItem.village}, {caseItem.district}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {caseItem.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end border-t sm:border-0 pt-4 sm:pt-0 border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPdf({ id: caseItem.id, filename: caseItem.pdfFileName, pdfUrl: caseItem.pdfUrl });
                      }}
                      disabled={isDownloadingPdf}
                    >
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                      {expandedRow === caseItem.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRow === caseItem.id && (
                  <div className="border-t border-border bg-slate-50 p-6 space-y-8 animate-in slide-in-from-top-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Original Problem Description</h5>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed">
                        {caseItem.issue}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent"></span> Tamil Guidance
                        </h5>
                        <div className="p-5 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed font-tamil whitespace-pre-wrap h-64 overflow-y-auto">
                          {caseItem.guidance}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary"></span> English Petition
                        </h5>
                        <div className="p-5 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed font-serif whitespace-pre-wrap h-64 overflow-y-auto">
                          {caseItem.petition}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const { adminPassword } = useStore();

  if (adminPassword) {
    return <AdminDashboardComponent />;
  }

  return <AdminLoginComponent />;
}
