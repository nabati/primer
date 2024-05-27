import { useQuery } from "@tanstack/react-query";
import getRelatedContext from "./getRelatedContext.ts";
import { Activity } from "./store.ts";

export type ContextEntry = {
  content: string[];
  journal_created_at: string;
  journal_updated_at: string;
};

const useRelatedContext = ({
  activity,
  journalId,
}: {
  activity: Activity;
  journalId: string;
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ["related-context", journalId, activity.content],
    queryFn: async () => {
      const context: ContextEntry[] = await getRelatedContext(
        activity.content,
        journalId,
      );
      return context;
    },
  });

  return {
    context: data,
    isFetching,
  };
};

export default useRelatedContext;
