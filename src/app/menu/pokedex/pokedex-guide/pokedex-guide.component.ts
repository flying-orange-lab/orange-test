import {
  Component,
  ComponentRef,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonStatComponent } from '../pokemon-stat/pokemon-stat.component';
import { HelperService } from 'src/app/services/helper.service';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokedex-guide',
  templateUrl: './pokedex-guide.component.html',
  styleUrl: './pokedex-guide.component.less',
  imports: [CommonModule, PokemonStatComponent, NgOptimizedImage],
})
export class PokedexGuideComponent {
  private helperService = inject(HelperService);
  private popoverRef: ComponentRef<PopoverComponent> | null = null;
  private lastClickedButton: HTMLElement | null = null;

  @ViewChild('popoverContainer', { read: ViewContainerRef })
  popoverContainer!: ViewContainerRef;

  pokemon: Pokemon = {
    id: 0,
    name: 'substitute',
    koreanName: '대타출동',
    imageUrl: 'substitute.png',
  };
  currentPokemonStats: number[] = [100, 50, 80, 60, 80, 50, 420];

  popoverMessages: Record<string, string> = {
    gender:
      '나타나는 sprite를 바꿉니다. 성별마다 sprite가 다른 경우에만 나타납니다.',
    sprite:
      '출력되는 sprite를 뒷모습으로 바꿉니다. 뒷모습 sprite가 있는 경우에만 나타납니다.',
    typebtn:
      '타입에 대한 방어 상성을 확인합니다. PC에서는 오른쪽에 나타나고, 모바일에서는 방어상성 페이지로 이동합니다.',
    ability:
      '특성 정보를 확인합니다. 클릭 시 특성에 대한 상세 설명이 나타납니다.',
    form: '다른 폼 정보를 확인합니다. 다른 폼이 있는 경우에만 나타납니다.',
    evol: '포켓몬의 진화에 대한 정보입니다.',
    wilditem: '포켓몬이 야생에서 나왔을 때, 가진 도구에 대한 정보입니다.',
    extra:
      '추가 서식 정보를 나타냅니다. 일반적으로 잡을 수 없는 포켓몬의 경우 정보가 나타납니다.',
    wilddetail:
      '야생에서의 등장위치 정보를 나타냅니다. 해당 정보가 없다면 야생에서 잡을 수 없습니다.',
    wilddetailbtn: '야생 위치 상세 정보로 이동합니다.',
  };

  get currentImageUrl() {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.imageUrl}`;
  }

  get displayId() {
    return '#' + String(this.pokemon.id).padStart(3, '0');
  }

  onCloseClick() {
    this.helperService.emitCloseHelper();
  }

  showPopover(event: MouseEvent, messageKey: string) {
    event.stopPropagation();
    const buttonElement = event.currentTarget as HTMLElement;
    if (this.lastClickedButton === buttonElement) {
      this.popoverContainer.clear();
      this.lastClickedButton = null; // 상태 초기화
      return; // 함수 종료
    }

    this.popoverContainer.clear();
    const rect = buttonElement.getBoundingClientRect();

    this.popoverRef = this.popoverContainer.createComponent(PopoverComponent);
    const popoverInstance = this.popoverRef.instance;

    // 팝오버 컴포넌트에 메시지 키와 버튼의 위치 정보 객체를 전달
    popoverInstance.message = this.popoverMessages[messageKey];
    popoverInstance.buttonRect = rect;

    this.lastClickedButton = buttonElement;
  }
}
