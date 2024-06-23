const QueryKey = {
  notes: {
    list: ({ priorityId }: { priorityId?: string } = {}) => [
      "notes",
      "priority-id",
      priorityId,
    ],
    single: (id: string) => ["notes-entry", id],
  },
  priorities: {
    list: () => ["priorities"],
    single: (id: string) => ["priority", id],
  },
  actions: {
    list: ({ priorityId }: { priorityId?: string } = {}) => [
      "actions",
      "priority-id",
      priorityId,
    ],
  },
};

export default QueryKey;
