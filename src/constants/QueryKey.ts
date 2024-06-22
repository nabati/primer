const QueryKey = {
  journals: {
    list: () => ["journals"],
    single: (id: string) => ["journals-entry", id],
  },
};

export default QueryKey;
