import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ HeaderComponent ],
      providers: [ TranslateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // it('should load all select harnesses', async () => {
  //   const selects = await loader.getAllHarnesses(MatSelectHarness);
  //   expect(selects.length).toBe(1);
  // });
  //
  // it('should be able to check whether a select is in multi-selection mode', async () => {
  //   const select = await loader.getHarness(MatSelectHarness);
  //
  //   expect(await select.isMultiple()).toBe(false);
  // });
  //
  // it('should be able to open and close a select', async () => {
  //   const select = await loader.getHarness(MatSelectHarness);
  //
  //   expect(await select.isOpen()).toBe(false);
  //
  //   await select.open();
  //   expect(await select.isOpen()).toBe(true);
  //
  //   await select.close();
  //   expect(await select.isOpen()).toBe(false);
  // });
  //
  // it('should be able to get the value text from a select', async () => {
  //   const select = await loader.getHarness(MatSelectHarness);
  //   await select.open();
  //   const options = await select.getOptions();
  //
  //   await options[2].click();
  //
  //   expect(await select.getValueText()).toBe('Tacos');
  // });
  //
  // it('should change language', () => {
  //   spyOn(component, 'changeLanguage');
  //
  //   component.ngOnInit();
  //
  //   fixture.whenStable().then(async () => {
  //     console.log('BEGIN TEST OPTION');
  //
  //     const select = await loader.getHarness(MatSelectHarness);
  //     await select.open();
  //     const options = await select.getOptions();
  //     await options[1].click();
  //
  //     expect(component.changeLanguage).toHaveBeenCalled();
  //   })
  // });
});
