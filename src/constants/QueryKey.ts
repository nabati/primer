const QueryKey = {
  notes: {
    list: ({ priorityId }: { priorityId?: string | null } = {}) => [
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
    single: ({ id }: { id: string }) => ["habit", id],
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
