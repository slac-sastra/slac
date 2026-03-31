"use client";

import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { translations } from "@/lib/translations";
import { submitCase } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Send, Loader2, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";

interface CaseResult {
  guidance: string;
  petition: string;
  summary: string;
  pdfUrl: string;
  pdfFileName: string;
  caseId: string;
}

export default function Home() {
  const { language } = useStore();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "", age: "", phone: "",
    village: "", taluk: "", district: "", issue: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await submitCase({
        ...formData,
        age: parseInt(formData.age, 10),
      });
      setResult({
        guidance: (res as any).guidance || "",
        petition: (res as any).petition || "",
        summary: (res as any).summary || "",
        pdfUrl: (res as any).pdfUrl || "",
        pdfFileName: (res as any).pdfFileName || "",
        caseId: res.caseId,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Scale className="w-4 h-4" />
                <span>AI-Powered Legal Assistance</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
                {t.appTitle}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(30,64,175,0.08),transparent)]" />
        </section>

        {/* Form + Results */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 pb-16 relative z-10">
          {!result ? (
            <Card className="shadow-xl border-0 animate-pulse-glow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-display">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  {language === "ta" ? "வழக்கு விவரங்கள்" : "Case Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">{t.age}</Label>
                      <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required placeholder={t.age} min="1" max="120" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t.phone} />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="village">{t.village}</Label>
                      <Input id="village" name="village" value={formData.village} onChange={handleChange} required placeholder={t.village} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taluk">{t.taluk}</Label>
                      <Input id="taluk" name="taluk" value={formData.taluk} onChange={handleChange} required placeholder={t.taluk} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">{t.district}</Label>
                      <Input id="district" name="district" value={formData.district} onChange={handleChange} required placeholder={t.district} />
                    </div>
                  </div>

                  {/* Issue */}
                  <div className="space-y-2">
                    <Label htmlFor="issue">{t.issue}</Label>
                    <Textarea
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      required
                      placeholder={t.issuePlaceholder}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} size="lg" className="w-full text-base font-semibold gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.generating}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* ========== Results Display ========== */
            <div className="space-y-6 animate-fade-in-up">
              {/* Success Banner */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <div>
                  <p className="font-semibold">{t.successAlert}</p>
                  <p className="text-sm opacity-80">Case ID: {result.caseId}</p>
                </div>
              </div>

              {/* Result Tabs */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-0">
                  <Tabs defaultValue="guidance" className="w-full">
                    <TabsList className="w-full rounded-none border-b bg-muted/30 p-0 h-auto">
                      <TabsTrigger value="guidance" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                        {t.guidance}
                      </TabsTrigger>
                      <TabsTrigger value="petition" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                        {t.petition}
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">
                        {t.summary}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="guidance" className="p-6">
                      <div className="prose max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
                        {result.guidance}
                      </div>
                    </TabsContent>

                    <TabsContent value="petition" className="p-6">
                      <div className="prose max-w-none whitespace-pre-wrap text-foreground leading-relaxed font-serif">
                        {result.petition}
                      </div>
                    </TabsContent>

                    <TabsContent value="summary" className="p-6">
                      <div className="prose max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
                        {result.summary}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* PDF Download + New Case */}
              <div className="flex flex-col sm:flex-row gap-4">
                {result.pdfUrl && (
                  <Button asChild size="lg" className="flex-1 gap-3 text-base">
                    <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-5 h-5" />
                      {t.downloadPdf}
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 text-base"
                  onClick={() => {
                    setResult(null);
                    setFormData({ name: "", age: "", phone: "", village: "", taluk: "", district: "", issue: "" });
                  }}
                >
                  {language === "ta" ? "புதிய வழக்கு" : "New Case"}
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
