import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WildStateService {
  // 열려있는 지역 인덱스 목록
  private expandedIndexes = new Set<number>();

  // 각 지역별 선택된 위치(RegionData) 상태 저장
  // key: 지역 index, value: 활성화된 RegionData의 locationStatus 이름 등을 저장해도 됨
  private selectedRegions: Record<number, string> = {};

  // 각 지역별 활성화된 탭 상태 저장 (encounter | habitat)
  private activeTabs: Record<number, 'encounter' | 'habitat'> = {};

  // 아코디언 열림/닫힘
  toggleExpanded(index: number, isExpanded: boolean): void {
    if (isExpanded) {
      this.expandedIndexes.add(index);
    } else {
      this.expandedIndexes.delete(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndexes.has(index);
  }

  // 선택된 지역 상태
  setSelectedRegion(index: number, locationStatus: string): void {
    this.selectedRegions[index] = locationStatus;
  }

  getSelectedRegion(index: number): string | undefined {
    return this.selectedRegions[index];
  }

  // 활성화된 탭 상태
  setActiveTab(index: number, tab: 'encounter' | 'habitat'): void {
    this.activeTabs[index] = tab;
  }

  getActiveTab(index: number): 'encounter' | 'habitat' {
    return this.activeTabs[index] || 'encounter'; // default
  }
}
