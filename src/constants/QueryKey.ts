const QueryKey = {
  notes: {
    list: () => ["notes"],
    single: (id: string) => ["notes-entry", id],
  },
  priorities: {
    list: () => ["priorities"],
    single: (id: string) => ["priority", id],
  },
};

export default QueryKey;
