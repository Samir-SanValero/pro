import {Component, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../../models/report-model';
import { TableColumn } from '../common/table/table.model';
import { environment } from '../../../environments/environment';
import { Pagination } from '../../models/common-model';
import { TemplateService } from '../../services/report/template.service';
import { Subscription } from 'rxjs';
import { TemplatesCreateEditViewComponent } from './templates-create-edit-view/templates-create-edit-view.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../common/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-template-screen',
  templateUrl: './template-screen.component.html',
  styleUrls: ['./template-screen.component.scss']
})
export class TemplateScreenComponent implements OnInit, OnDestroy {
  defaultPageSizes = environment.templateTableDefaultPageSizes;
  page: number;
  pageSize: number = environment.templateTableDefaultPageSizes[0];

  loading: boolean;
  showRecord: boolean;
  unlockFields: boolean;

  pagination: Pagination;

  templates: Template[];
  templatesUnsorted: Template[];

  editingTemplate: Template;

  public dialogResult: boolean;

  tableColumns: Array<TableColumn>;

  templateSubscription: Subscription;
  deleteTemplateSubscription: Subscription;
  setFavouriteSubscription: Subscription;

  dialogRef: MatDialogRef<TemplatesCreateEditViewComponent>;
  togglingActivation: boolean;

  constructor(public translateService: TranslateService,
              public templateService: TemplateService,
              public notificationMessage: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = false;
    this.pagination = new Pagination();

    this.tableColumns = new Array<TableColumn>();

    const tableColumnIndividualFavourite: TableColumn = {
      name: 'TEMPLATES.individual-favourite-column',
      dataKey: 'individualFavourite',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true,
      showBooleanCustomIcon: 'assignment_turned_in',
    };

    const tableColumnCoupleFavourite: TableColumn = {
      name: 'TEMPLATES.couple-favourite-column',
      dataKey: 'coupleFavourite',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true,
      showBooleanCustomIcon: 'assignment_turned_in',
    };

    const tableColumnDonorFavourite: TableColumn = {
      name: 'TEMPLATES.donor-favourite-column',
      dataKey: 'donorFavourite',
      position: 'left',
      isSortable: false,
      showBooleanIcon: true,
      showBooleanCustomIcon: 'assignment_turned_in',
    };

    const nameColumn: TableColumn = {
      name: 'template-screen.name-column',
      dataKey: 'name',
      position: 'left',
      isSortable: true
    };

    const versionColumn: TableColumn = {
      name: 'template-screen.version-column',
      dataKey: 'version',
      position: 'left',
      isSortable: true
    };

    const companyColumn: TableColumn = {
      name: 'template-screen.company-column',
      dataKey: 'companyName',
      position: 'left',
      isSortable: true
    };

    const columnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.tableColumns.push(tableColumnIndividualFavourite);
    this.tableColumns.push(tableColumnCoupleFavourite);
    this.tableColumns.push(tableColumnDonorFavourite);
    this.tableColumns.push(nameColumn);
    this.tableColumns.push(companyColumn);
    this.tableColumns.push(versionColumn);
    this.tableColumns.push(columnActions);

    this.processListTemplates();
  }

  ngOnDestroy(): void {
    if (this.templateSubscription !== undefined) {
      this.templateSubscription.unsubscribe();
    }

    if (this.deleteTemplateSubscription !== undefined) {
      this.deleteTemplateSubscription.unsubscribe();
    }

    if (this.setFavouriteSubscription !== undefined) {
      this.setFavouriteSubscription.unsubscribe();
    }
  }

  processListTemplates(): void {
      const obs = this.templateService.listTemplatePagination(this.pagination);
      if (obs !== null && obs !== undefined) {
        this.templateSubscription = obs.subscribe((templateData) => {
          if (templateData._embedded !== undefined) {
            this.templates = templateData._embedded[environment.linkTemplateModelList] as Array<Template>;
            this.templatesUnsorted = templateData._embedded[environment.linkTemplateModelList] as Array<Template>;
            console.log('Template screen - recovered templates');
            const templateList = new Array<Template>();
            for (const template of this.templates) {
              templateList.push(Template.fromObject(template));
            }
            this.templates = templateList;
            this.loading = false;
            if (templateData.page !== undefined) {
              this.pagination.currentPag = templateData.page.number;
              this.pagination.numberOfPages = templateData.page.totalPages;
              this.pagination.totalElements = templateData.page.totalElements;
            }
          }
        });
      }
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListTemplates();
  }

  showRecordTemplate(template: Template): void {
    console.log('TEMMPLATE: ' + template.name);

    this.editingTemplate = template;
    // this.showRecord = true;

    this.dialogRef = this.dialog.open(TemplatesCreateEditViewComponent,
      {
        width: '800px',
        data: {
          template: template,
          editMode: true
        }
      });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.syncData();
      }
    });
  }

  deleteTemplate(deletingTemplate: Template): void {
    const dialogData = new ConfirmDialogModel(
      'template-screen.messages.template-confirmation-title',
      'template-screen.messages.template-deleting-question',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
        this.dialogResult = dialogResult as boolean;
        if (this.dialogResult) {
          console.log('Confirmed template deletion');
          console.log('Template screen component - deleting bank: ');

          for (const template of this.templates) {
            if (template._links.self.href === deletingTemplate._links.self.href) {
              try {
                this.deleteTemplateSubscription = this.templateService.deleteTemplate(template).subscribe(
                  () => {
                    this.templates = this.templates.filter(
                      templateFiltered => (
                        template._links.self !== templateFiltered._links.self
                      )
                    );
                    this.showNotification('template-screen.messages.template-deleted', 'notification-class');
                  },
                  error => {
                    console.log('Error caught: ' + error);
                    this.showNotification('template-screen.messages.template-not-saved', 'notification-class-warn');
                  }
                );
              } catch (e) {
                console.log('');
                this.showNotification('template-screen.messages.template-not-saved', 'notification-class-warn');
              }
            }
          }

        } else {
          console.log('Canceled template deletion');
        }
      },
      error => {
        this.showNotification(error, 'notification-class');
      });
  }

  newTemplate(): void {
    this.editingTemplate = new Template();
    // this.showRecord = true;

    this.dialogRef = this.dialog.open(TemplatesCreateEditViewComponent,
      {
        width: '800px',
        data: {
          template: this.editingTemplate,
          createMode: true
        }
      });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.syncData();
      }
    });
  }

  backButton(): void {
    this.unlockFields = false;
    this.showRecord = false;
  }

  editButton(): void {
    this.unlockFields = true;
  }

  recordButton(): void {
    this.unlockFields = false;
  }

  showNotification(message: string, panelClass: string): void {
    this.notificationMessage.openFromComponent(NotificationComponent, {
      data: message,
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  toggleTableField(event: any): void {
    console.log(event[0]);
    console.log(event[1] as Template);

    const columnName = event[0] as string;
    const toggledTemplate = event[1] as Template;

    console.log('COLUMN NAME: ' + columnName);
    console.log('TEMPLATE NAME: ' + toggledTemplate.name);

    if (columnName === 'individualFavourite') {
      this.togglingActivation = true;
      for (const template of this.templates) {
        if (toggledTemplate.name === template.name) {
          console.log('Found template to toggle, individual favourite');
          this.makeIndividualFavourite(template);
        }
      }
    }

    if (columnName === 'coupleFavourite') {
      this.togglingActivation = true;
      for (const template of this.templates) {
        if (toggledTemplate.name === template.name) {
          console.log('Found template to toggle, couple favourite');
          this.makeCoupleFavourite(template);
        }
      }
    }

    if (columnName === 'donorFavourite') {
      this.togglingActivation = true;
      for (const template of this.templates) {
        if (toggledTemplate.name === template.name) {
          console.log('Found template to toggle, donor favourite');
          this.makeDonorFavourite(template);
        }
      }
    }
  }

  makeIndividualFavourite(template: Template) {
    this.setFavouriteSubscription = this.templateService.setFavourite(template, 'individual',
      this.translateService.currentLang.toLowerCase()).subscribe(favouriteData => {
    });

    this.showNotification('TEMPLATES.individual-favourite-done', undefined);
  }

  makeCoupleFavourite(template: Template) {
    this.setFavouriteSubscription = this.templateService.setFavourite(template, 'couple',
      this.translateService.currentLang.toLowerCase()).subscribe(favouriteData => {
    });

    this.showNotification('TEMPLATES.couple-favourite-done', undefined);
  }

  makeDonorFavourite(template: Template) {
    this.setFavouriteSubscription = this.templateService.setFavourite(template, 'donor',
      this.translateService.currentLang.toLowerCase()).subscribe(favouriteData => {
    });

    this.showNotification('TEMPLATES.donor-favourite-done', undefined);
  }

}
