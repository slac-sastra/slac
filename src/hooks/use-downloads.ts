import { useMutation } from '@tanstack/react-query';
import { getPdfDownloadUrl, downloadCsvUrl } from '@/lib/api';

export function useDownloadPdf() {
  return useMutation({
    mutationFn: async ({ id, filename, pdfUrl }: { id: string; filename: string; pdfUrl?: string }) => {
      // If we have a direct Firebase Storage URL, use it; otherwise hit the Functions endpoint
      const url = pdfUrl || getPdfDownloadUrl(id);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `case-${id}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  });
}

export function useDownloadCsv() {
  return useMutation({
    mutationFn: async (password: string) => {
      const url = downloadCsvUrl(password);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to export CSV');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `sastra-cases-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    },
  });
}
