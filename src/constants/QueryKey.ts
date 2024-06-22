const QueryKey = {
  notes: {
    list: () => ["notes"],
    single: (id: string) => ["notes-entry", id],
  },
};

export default QueryKey;
