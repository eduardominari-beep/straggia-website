export const CITY_CONFIG = {
  "sao-paulo": { name: "São Paulo", uf: "SP", priority: 1, strategicWeight: 1.0 },
  "sao-bernardo-do-campo": { name: "São Bernardo do Campo", uf: "SP", priority: 2, strategicWeight: 0.9 },
  "santo-andre": { name: "Santo André", uf: "SP", priority: 2, strategicWeight: 0.9 },
  "sao-caetano-do-sul": { name: "São Caetano do Sul", uf: "SP", priority: 2, strategicWeight: 0.85 },
  diadema: { name: "Diadema", uf: "SP", priority: 2, strategicWeight: 0.85 },
  maua: { name: "Mauá", uf: "SP", priority: 2, strategicWeight: 0.8 },
  guarulhos: { name: "Guarulhos", uf: "SP", priority: 1, strategicWeight: 0.95 },
  osasco: { name: "Osasco", uf: "SP", priority: 1, strategicWeight: 0.95 },
  barueri: { name: "Barueri", uf: "SP", priority: 1, strategicWeight: 0.98 },
};

export function getCityConfig(cityKey) {
  return CITY_CONFIG[cityKey] ?? null;
}
