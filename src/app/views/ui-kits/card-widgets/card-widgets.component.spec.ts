import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWidgetsComponent } from './card-widgets.component';

describe('CardWidgetsComponent', () => {
  let component: CardWidgetsComponent;
  let fixture: ComponentFixture<CardWidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardWidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
