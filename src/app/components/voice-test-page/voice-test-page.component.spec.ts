import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceTestPageComponent } from './voice-test-page.component';

describe('VoiceTestPageComponent', () => {
  let component: VoiceTestPageComponent;
  let fixture: ComponentFixture<VoiceTestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoiceTestPageComponent]
    });
    fixture = TestBed.createComponent(VoiceTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
