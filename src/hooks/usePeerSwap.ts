import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { peerswap } from '../lib/peerswap';
import type { 
  PeerSwapSwapInRequest, 
  PeerSwapSwapOutRequest,
  PeerSwapGetSwapsInfoRequest,
} from 'peerswap-sdk';

export function useNodeInfo() {
  return useQuery({
    queryKey: ['nodeInfo'],
    queryFn: () => peerswap.peerSwapGetNodeInfo(),
  });
}

export function useSwapIn(id: string) {
  return useQuery({
    queryKey: ['swapIn', id],
    queryFn: () => peerswap.peerSwapGetSwapIn({ id }),
    enabled: !!id,
  });
}

export function useSwapOut(id: string) {
  return useQuery({
    queryKey: ['swapOut', id],
    queryFn: () => peerswap.peerSwapGetSwapOut({ id }),
    enabled: !!id,
  });
}

export function useInitiateSwapIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: PeerSwapSwapInRequest) =>
      peerswap.peerSwapSwapIn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
    },
  });
}

export function useInitiateSwapOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: PeerSwapSwapOutRequest) =>
      peerswap.peerSwapSwapOut(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
    },
  });
}

export function useSwapsList(params: PeerSwapGetSwapsInfoRequest = { body: { limit: 10, offset: 0 } }) {
  return useQuery({
    queryKey: ['swaps', params],
    queryFn: () => peerswap.peerSwapGetSwapsInfo(params),
  });
}
