const QueryKey = {
  notes: {
    list: ({ priorityId }: { priorityId?: string } = {}) => [
      "notes",
      "priority-id",
      priorityId,
    ],
    single: (id: string) => ["notes-entry", id],
  },
  habits: {
    list: ({ priorityId }: { priorityId?: string } = {}) => [
      "habits",
      "priority-id",
      priorityId,
    ],
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
