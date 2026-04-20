const isHostedDeployment = () =>
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL === '1' ||
  process.env.VERCEL === 'true' ||
  Boolean(process.env.VERCEL_URL);

const canUseMemoryFallback = () =>
  process.env.ALLOW_MEMORY_FALLBACK === 'true' || !isHostedDeployment();

module.exports = { isHostedDeployment, canUseMemoryFallback };
