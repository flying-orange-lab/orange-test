import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataHandleService } from 'src/app/services/data-handle.service';
import { PokemonImageService } from 'src/app/services/pokemon-image.service';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonStatComponent } from '../pokemon-stat/pokemon-stat.component';
import { PokemonAbility } from 'src/app/models/ability.model';
import { PokemonLocationComponent } from '../pokemon-location/pokemon-location.component';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonModalComponent } from '../pokemon-modal/pokemon-modal.component';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.less'],
  imports: [PokemonStatComponent, PokemonLocationComponent],
})
export class PokemonCardComponent implements OnInit, OnDestroy, OnChanges {
  private router = inject(Router);
  private dataHandleService = inject(DataHandleService);
  private pokemonService = inject(PokemonService);
  private pokemonImageService = inject(PokemonImageService);
  private dialog = inject(MatDialog);

  @Input() pokemon!: Pokemon;
  @Input() useSprite = false;
  @Output() defenseEvent = new EventEmitter<string[]>();
  currentPokemonStats: number[] = [0, 0, 0, 0, 0, 0, 0];
  currentAbility?: PokemonAbility;
  currentAbilityIndex?: number;
  hasGender = false;
  isFront = true;
  isGenderFemale = false;

  currentFormIndex = 0;
  currentImageUrl = '';

  async ngOnInit() {
    // sprite 출력이 필요한 경우에만 처리
    if (this.useSprite) {
      const keyUrl = this.currentKeyname + '-female';
      this.hasGender = await this.pokemonImageService.hasImage(keyUrl);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon'] && this.pokemon) {
      this.currentFormIndex = 0; // 새로운 포켓몬이 로드되면 폼을 초기화
      this.updatePokemonInfo();
    }
  }

  get currentPokemon(): any {
    // 폼이 있다면 현재 선택된 폼의 데이터를, 없다면 포켓몬 기본 데이터를 반환
    return this.pokemon.form?.[this.currentFormIndex] || this.pokemon;
  }

  get evolutionConditionArray() {
    return this.currentPokemon.evolutionCondition
      .split(',')
      .map((item: string) => item.trim());
  }

  get pokemonExtraText() {
    return this.currentPokemon.extra
      .split('.')
      .map((item: string) => item.trim());
  }

  get currentImageAltPath() {
    let altPath = this.pokemon.imageUrl;
    if (!altPath && this.pokemon.form) {
      altPath = this.pokemon.form[this.currentFormIndex].imageUrl;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${altPath}`;
  }

  get currentKeyname() {
    let urlKey = String(this.pokemon.id).padStart(3, '0');

    const prefix = this.isFront ? 'front' : 'back';
    urlKey = `${prefix}-${urlKey}`;

    if (this.currentFormIndex > 0) {
      urlKey += `-${this.currentFormIndex}`;
    }
    return urlKey;
  }

  get currentMoveKeyName() {
    return `${this.pokemon.id}-${this.currentFormIndex}`;
  }

  get displayId() {
    return '#' + String(this.pokemon.id).padStart(3, '0');
  }

  displayType(typeName: string) {
    return this.pokemonService.engToKorTypeMapper(typeName);
  }

  // 폼 선택
  selectForm(index: number): void {
    if (this.currentFormIndex !== index) {
      this.currentFormIndex = index;
      this.currentAbility = undefined;
      this.currentAbilityIndex = undefined;
      this.updatePokemonInfo(); // 폼이 바뀌면 이미지 업데이트
    }
  }

  // 앞/뒷면 토글
  toggleSprite(): void {
    this.isFront = !this.isFront;
    this.updatePokemonInfo(); // 앞/뒷면이 바뀌면 이미지 업데이트
  }

  // 성별 토글
  toggleGender(): void {
    this.isGenderFemale = !this.isGenderFemale;
    this.updatePokemonInfo(); // 성별이 바뀌면 이미지 업데이트
  }

  clickAbility(AbilityName: string, index: number) {
    if (
      this.currentAbility?.name == AbilityName &&
      this.currentAbilityIndex == index
    ) {
      this.currentAbility = undefined;
      this.currentAbilityIndex = undefined;
    } else {
      this.currentAbility = this.pokemonService.findAbility(AbilityName);
      this.currentAbilityIndex = index;
    }
  }

  // 포켓몬 정보 업데이트
  async updatePokemonInfo() {
    this.currentPokemonStats = this.currentPokemon.stats || [];
    await this.updateImageUrl();
  }

  async updateImageUrl(): Promise<void> {
    // sprite 출력이 필요한 경우에만 처리
    if (!this.useSprite) {
      this.currentImageUrl = this.currentImageAltPath;
      return;
    }

    let urlKey = this.currentKeyname;
    if (this.isGenderFemale) {
      const genderKey = urlKey + '-female';
      if (await this.pokemonImageService.hasImage(genderKey)) {
        urlKey = genderKey;
      }
    }

    const imageBlob = await this.pokemonImageService.getImage(urlKey);
    if (!imageBlob) {
      this.currentImageUrl = this.currentImageAltPath;
    } else {
      this.currentImageUrl = URL.createObjectURL(imageBlob);
    }
  }

  goToDefensePage(types: string[]): void {
    this.defenseEvent.emit(types);
  }

  openModal() {
    this.dialog.open(PokemonModalComponent, {
      width: '96vw',
      height: '96vh',
      maxWidth: '840px',
      backdropClass: 'blur-backdrop',
      panelClass: 'no-padding-dialog', // 전역 CSS에서 여백 제거용
      data: {
        'currentMoveKeyName': this.currentMoveKeyName,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.currentImageUrl) {
      URL.revokeObjectURL(this.currentImageUrl);
    }
  }
}
