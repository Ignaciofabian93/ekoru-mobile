import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ACCEPT_DEAL,
  CANCEL_DEAL,
  CONFIRM_DEAL,
  DECLINE_DEAL,
  DISPUTE_DEAL,
} from "@/graphql/deals/mutations";
import { MY_DEALS_AS_BUYER, MY_DEALS_AS_SELLER } from "@/graphql/deals/queries";
import { showError, showSuccess } from "@/lib/toast";

import { NAMESPACE } from "../i18n";

const REFETCH = [{ query: MY_DEALS_AS_BUYER }, { query: MY_DEALS_AS_SELLER }];

/**
 * Deal state transitions. Lists are refetched so the UI reflects the new status.
 * (Evidence-photo upload on confirm is deferred; `confirmDeal` sends no photo.)
 */
export default function useDealActions() {
  const { t } = useTranslation(NAMESPACE);
  const [busyId, setBusyId] = useState<number | null>(null);

  const opts = { refetchQueries: REFETCH, awaitRefetchQueries: false };
  const [accept] = useMutation(ACCEPT_DEAL, opts);
  const [decline] = useMutation(DECLINE_DEAL, opts);
  const [confirm] = useMutation(CONFIRM_DEAL, opts);
  const [dispute] = useMutation(DISPUTE_DEAL, opts);
  const [cancel] = useMutation(CANCEL_DEAL, opts);

  async function run<T>(id: number, fn: () => Promise<T>): Promise<T | null> {
    setBusyId(id);
    try {
      return await fn();
    } catch (err) {
      showError({ message: err instanceof Error ? err.message : t("genericError") });
      return null;
    } finally {
      setBusyId(null);
    }
  }

  return {
    busyId,
    acceptDeal: (id: number) =>
      run(id, async () => {
        await accept({ variables: { id } });
        showSuccess({ message: t("toastAccepted") });
      }),
    declineDeal: (id: number, reason?: string) =>
      run(id, () => decline({ variables: { id, reason } })),
    confirmDeal: (id: number) =>
      run(id, async () => {
        await confirm({ variables: { id, evidenceUrl: undefined } });
        showSuccess({ message: t("toastConfirmed") });
      }),
    disputeDeal: (id: number, reason: string) =>
      run(id, () => dispute({ variables: { id, reason } })),
    cancelDeal: (id: number, reason?: string) =>
      run(id, () => cancel({ variables: { id, reason } })),
  };
}
