const DEFAULT_LATENCY_MS = 350;

const wait = (duration = DEFAULT_LATENCY_MS) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

export const withMockLatency = async <T>(factory: () => T) => {
  await wait();
  return factory();
};
