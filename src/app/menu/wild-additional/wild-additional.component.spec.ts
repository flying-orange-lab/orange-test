import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildAdditionalComponent } from './wild-additional.component';

describe('WildAdditionalComponent', () => {
  let component: WildAdditionalComponent;
  let fixture: ComponentFixture<WildAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WildAdditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WildAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
