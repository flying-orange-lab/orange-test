import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenHollowComponent } from './hidden-hollow.component';

describe('HiddenHollowComponent', () => {
  let component: HiddenHollowComponent;
  let fixture: ComponentFixture<HiddenHollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenHollowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenHollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
