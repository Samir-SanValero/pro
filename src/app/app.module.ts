import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './services/authentication/jwt.interceptor';
import { AuthenticationService } from './services/authentication/authentication.service';
import { appInitializer } from './services/authentication/app.initializer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RedirectGuard } from './services/authentication/redirect.guard';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BankScreenModule } from './modules/bank-screen/bank-screen.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestScreenModule } from './modules/request-screen/request-screen.module';
import { AuthGuard } from './services/authentication/auth.guard';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { NotificationComponent } from './modules/common/notification/notification.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogModule } from './modules/common/confirm-dialog/confirm-dialog.module';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { GroupScreenComponent } from './modules/group-screen/group-screen.component';
import { HeaderModule } from './modules/header/header.module';
import { MainMenuModule } from './modules/main-menu/main-menu.module';
import { TableModule } from './modules/common/table/table.module';
import { FooterModule } from './modules/footer/footer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorI18nService } from './modules/common/table/mat-paginator-i18n.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { PRECON_DATE_FORMAT } from './models/common-model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RuleScreenModule } from './modules/rule-screen/rule-screen.module';
import { ReportComponent } from './modules/reports/report/report.component';
import { ReportsComponent } from './modules/reports/reports.component';
import {DataComponent} from './modules/reports/report/data/data.component';
import {FlexModule} from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    exports: [
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        NotificationComponent,
        GroupScreenComponent,
        ReportsComponent,
        ReportComponent,
        DataComponent
    ],
    imports: [
        MatToolbarModule,
        MatListModule,
        MatSidenavModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        MatSortModule,
        MatPaginatorModule,

        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BankScreenModule,
        RequestScreenModule,
        ConfirmDialogModule,
        HeaderModule,
        MainMenuModule,
        TableModule,
        FooterModule,
        FormsModule,
        MatCardModule,
        MatNativeDateModule,
        RuleScreenModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        MatGridListModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        FlexModule,
        MatCheckboxModule
    ],
    providers: [
        HttpClient,
        AuthenticationService,
        RedirectGuard,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService] },
        { provide: MatPaginatorIntl, useClass: MatPaginatorI18nService },
        { provide: MAT_DATE_FORMATS, useValue: PRECON_DATE_FORMAT }
        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
