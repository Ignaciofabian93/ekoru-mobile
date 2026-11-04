import { ADD_QUOTATION, GET_MY_QUOTATIONS } from "@/graphql/services/quotations";
import { showError } from "@/lib/toast";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export interface QuoteDraft {
  title: string;
  description: string;
  notes: string;
}

const emptyDraft: QuoteDraft = { title: "", description: "", notes: "" };

/**
 * Asks a provider for a quote, the same request as the web's quote dialog
 * (WEB-4). The client describes the job and the provider replies with a price
 * from their quotes; no price is sent from here, since proposing one would
 * turn a request into an offer.
 */
export default function useRequestQuote(serviceId: string) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [done, setDone] = useState(false);
  const [addQuotation, { loading }] = useMutation(ADD_QUOTATION, {
    refetchQueries: [{ query: GET_MY_QUOTATIONS }],
  });

  const isValid = draft.title.trim().length > 2 && draft.description.trim().length > 9;

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!isValid) {
      showError({ title: t("detail.quote.errors.incomplete") });
      return;
    }
    try {
      await addQuotation({
        variables: {
          input: {
            // The provider is the service's seller, set by the services subgraph.
            serviceId: Number(serviceId),
            title: draft.title.trim(),
            description: draft.description.trim(),
            clientNotes: draft.notes.trim() || undefined,
          },
        },
      });
      setDone(true);
    } catch (error) {
      showError({
        title: t("detail.quote.errors.failed"),
        message: error instanceof Error ? error.message : "",
      });
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setDone(false);
  };

  return { draft, update, isValid, loading, done, submit, reset };
}
