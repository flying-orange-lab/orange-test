export interface MoveDetail {
  id: number;
  name: string;
  type: string; // 상성 타입
  class: string; // 물리, 특수, 변화
  power: string;
  accuracy: string;
  pp: number;
  makeContact: boolean;
  category?: string[]; // 분류: 소리, 킥, 펀치 등등
  targeting?: string;
  effects: MoveEffect;
}

export interface MoveEffect {
  inflict?: string; // 상태
  changeStatusTarget?: string;
  changeStatusMe?: string;
  etc?: string;
}
