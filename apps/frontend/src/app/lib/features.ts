/**
 * Feature flags simples para testes A/B
 * Pode ser expandido para buscar do backend ou localStorage
 */
export const features = {
  // A/B: selo no plano premium
  // false -> "GARANTIA 7 DIAS", true -> "MAIS POPULAR"
  popularBadge: false,

  // Ativar barra de promoção global
  promoBarEnabled: true,

  // Ativar exit-intent modal
  exitIntentEnabled: true,

  // Hotjar (gatilho por env)
  hotjarEnabled: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_HOTJAR_ID ? true : false,
} as const;

export type FeatureKey = keyof typeof features;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return features[key] ?? false;
}
