import { useQuery } from "@tanstack/react-query";
import getRelatedContext from "./getRelatedContext.ts";
import { Activity } from "./store.ts";

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
      const context: string[] = await getRelatedContext(
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
