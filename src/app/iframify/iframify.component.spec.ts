import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframifyComponent } from './iframify.component';

describe('IframifyComponent', () => {
  let component: IframifyComponent;
  let fixture: ComponentFixture<IframifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
