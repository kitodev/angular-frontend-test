import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleNameDialogComponent } from './edit-role-name-dialog.component';

describe('EditRoleNameDialogComponent', () => {
  let component: EditRoleNameDialogComponent;
  let fixture: ComponentFixture<EditRoleNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoleNameDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRoleNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
