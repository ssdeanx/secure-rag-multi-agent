// Lightweight mock for mastra export to bypass heavy agent/workflow initialization during UI tests.
export const mastra = {
  register: () => {},
  getAgent: () => ({ run: async () => ({ mocked: true }) }),
};
