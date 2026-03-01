import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'pokemon_favorites';
  private favoritesSubject: BehaviorSubject<number[]>;

  constructor() {
    this.favoritesSubject = new BehaviorSubject<number[]>(this.loadFavorites());
  }

  // 로컬 스토리지에서 즐겨찾기 목록 불러오기 (배열 순서 유지)
  private loadFavorites(): number[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
    return [];
  }

  // 즐겨찾기 상태 변경 시 저장 및 이벤트 발생
  private saveFavorites(favorites: number[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  // 즐겨찾기 토글 (배열의 끝에 추가하거나, 존재하면 제거)
  toggleFavorite(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.getValue();
    const index = currentFavorites.indexOf(pokemonId);

    if (index > -1) {
      // 이미 존재하면 제거
      currentFavorites.splice(index, 1);
    } else {
      // 존재하지 않으면 배열 끝에 추가 (클릭한 순서대로 저장)
      currentFavorites.push(pokemonId);
    }

    this.saveFavorites(currentFavorites);
  }

  // 특정 포켓몬이 즐겨찾기에 있는지 확인
  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.getValue().includes(pokemonId);
  }

  // 즐겨찾기 목록 Observable 반환
  getFavoritesObservable(): Observable<number[]> {
    return this.favoritesSubject.asObservable();
  }

  // 현재 즐겨찾기 목록(배열) 반환
  getFavorites(): number[] {
    return this.favoritesSubject.getValue();
  }
}
