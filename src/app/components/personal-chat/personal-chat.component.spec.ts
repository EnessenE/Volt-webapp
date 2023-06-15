import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalChatComponent } from './personal-chat.component';

describe('PersonalChatComponent', () => {
  let component: PersonalChatComponent;
  let fixture: ComponentFixture<PersonalChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalChatComponent]
    });
    fixture = TestBed.createComponent(PersonalChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
