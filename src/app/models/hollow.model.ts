export interface HiddenHollow {
  locationName: string; // 예: "2번 도로", "미로의 숲"
  description?: string;
  groups: ProbabilityGroup[];
}

export interface ProbabilityGroup {
  rateType: '자주' | '간혹' | '가끔';
  pokemonName: string;
  ability: string;
}
