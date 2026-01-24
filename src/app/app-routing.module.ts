import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokedexComponent } from './menu/pokedex/pokedex.component';
import { DefenseComponent } from './menu/defense/defense.component';
import { WildComponent } from './menu/wild/wild.component';
import { ItemsComponent } from './menu/items/items.component';
import { MartComponent } from './menu/mart/mart.component';
import { MoveDetailComponent } from './menu/move-detail/move-detail.component';
import { HiddenHollowComponent } from './menu/hidden-hollow/hidden-hollow.component';

const routes: Routes = [
  { path: ':gameVersion', component: HomeComponent, data: { title: '홈' } },
  {
    path: ':gameVersion/pokedex',
    component: PokedexComponent,
    data: { title: '도감' },
  },
  {
    path: ':gameVersion/defense',
    component: DefenseComponent,
    data: { title: '방어상성' },
  },
  {
    path: ':gameVersion/wild',
    component: WildComponent,
    data: { title: '서식지' },
  },
  {
    path: ':gameVersion/item',
    component: ItemsComponent,
    data: { title: '아이템' },
  },
  {
    path: ':gameVersion/mart',
    component: MartComponent,
    data: { title: '프렌들리숍' },
  },
  {
    path: ':gameVersion/move-detail',
    component: MoveDetailComponent,
    data: { title: '기술 정보' },
  },
  {
    path: ':gameVersion/hollow',
    component: HiddenHollowComponent,
    data: { title: '은혈 정보' },
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', // 라우팅 시 스크롤 위치 복원 활성화
  anchorScrolling: 'enabled', // 앵커 링크 (#) 스크롤 활성화
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
