export interface WildAdditionalPokemonInfo {
  name: string; // 포켓몬
  level: number; // 레벨
  location: string; // 위치
  requirement: string; // 선행조건
  note: string; // 비고
}

export interface WildAdditionalPokemonCategory {
  title: string;
  data: WildAdditionalPokemonInfo[];
}
