import api from '@/api/instance.ts';

export async function refreshStatus(proposalId: number) {
  try {
    await api.patch(`/proposals/${proposalId}/refresh-status`);
  } catch {
    // If the Notification API fails, we don't need to care, because there is a fallback
  }
}
