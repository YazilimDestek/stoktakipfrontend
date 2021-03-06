import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContentsComponent } from './chat-contents.component';

describe('ChatContentsComponent', () => {
  let component: ChatContentsComponent;
  let fixture: ComponentFixture<ChatContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
