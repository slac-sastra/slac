import { useQuery } from '@tanstack/react-query';
import { getCases, CasesResponse } from './api';

export function useAdminGetCases(
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
