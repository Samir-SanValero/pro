import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { RuleService } from '../../services/genetic/rule.service';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../common/table/table.model';
import { NotificationComponent } from '../common/notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { TableService } from '../../services/common/table.service';
import { HalObject, Pagination, RuleDialogData } from '../../models/common-model';
import { Action, Condition, Gene, Rule, RuleConditionGroup } from '../../models/genetic-model';
import { RuleScreenDialogComponent } from './rule-screen-dialog/rule-screen-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-rule-screen',
  templateUrl: './rule-screen.component.html',
  styleUrls: ['./rule-screen.component.scss']
})
export class RuleScreenComponent implements OnInit, OnDestroy {
  GROUP_A = 'groupA';
  GROUP_B = 'groupB';

  step = 0;

  defaultPageSizes = environment.ruleTableDefaultPageSizes;
  page: number;
  pageSize: number = environment.ruleTableDefaultPageSizes[0];
  sortField: string;
  sort: string;
  pagination: Pagination;

  loading: boolean;
  creating: boolean;
  showRecord: boolean;
  unlockFields: boolean;
  public adding: boolean;

  editingRule: Rule;
  editingConditionsA: Array<Condition>;
  editingConditionsB: Array<Condition>;
  editingActions: Array<Action>;

  public dataSource: any;
  public currentPageSize = 5;

  public showDeleteDialog: boolean;
  public dialogResult: boolean;

  public rules: Array<Rule>;

  public selectedRule: Rule;

  ruleTableColumns: Array<TableColumn>;
  conditionTableColumns: Array<TableColumn>;
  actionTableColumns: Array<TableColumn>;

  changePageSubscription: Subscription;
  changePageSizeSubscription: Subscription;

  rulesSubscription: Subscription;

  editingRuleSubscription: Subscription;
  editingConditionsSubscription: Subscription;

  groupsSubscription: Subscription;
  addRuleSubscription: Subscription;
  deleteRuleSubscription: Subscription;
  dialogSubscription: Subscription;
  conditionGeneSubscription: Subscription;

  searchFields: Array<string>;

  // Coincidence
  coincidenceAll = 'COINCIDENCE_ALL';
  coincidenceAny = 'COINCIDENCE_ANY';

  coincidenceOptions = [ this.coincidenceAll, this.coincidenceAny ];

  constructor(
    public ruleService: RuleService,
    public dialog: MatDialog,
    public notificationMessage: MatSnackBar,
    public translateService: TranslateService,
    public tableService: TableService
  ) {}

  ngOnInit(): void {
    console.log('Rule screen');
    this.pagination = new Pagination();
    this.pagination.currentPagSize = this.pageSize;

    this.showDeleteDialog = false;
    this.showRecord = false;
    this.adding = false;
    this.loading = true;

    this.loadRuleTable();
    this.processListRules();
  }

  ngOnDestroy(): void {
    if (this.changePageSubscription !== undefined) {
      this.changePageSubscription.unsubscribe();
    }

    if (this.changePageSizeSubscription !== undefined) {
      this.changePageSizeSubscription.unsubscribe();
    }

    if (this.rulesSubscription !== undefined) {
      this.rulesSubscription.unsubscribe();
    }

    if (this.groupsSubscription !== undefined) {
      this.groupsSubscription.unsubscribe();
    }

    if (this.addRuleSubscription !== undefined) {
      this.addRuleSubscription.unsubscribe();
    }

    if (this.deleteRuleSubscription !== undefined) {
      this.deleteRuleSubscription.unsubscribe();
    }

    if (this.dialogSubscription !== undefined) {
      this.dialogSubscription.unsubscribe();
    }

    if (this.editingRuleSubscription !== undefined) {
      this.editingRuleSubscription.unsubscribe();
    }

    if (this.editingConditionsSubscription !== undefined) {
      this.editingConditionsSubscription.unsubscribe();
    }

    if (this.conditionGeneSubscription !== undefined) {
      this.conditionGeneSubscription.unsubscribe();
    }
  }

  loadRuleTable(): void {
    this.ruleTableColumns = new Array<TableColumn>();

    const ruleColumnState: TableColumn = {
      name: 'rule-screen.name-column',
      dataKey: 'name',
      position: 'left',
      isSortable: true
    };

    const ruleColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.ruleTableColumns.push(ruleColumnState);
    this.ruleTableColumns.push(ruleColumnActions);

    this.tableService.selectPageSize(this.pageSize);
    this.searchFields = new Array<string>();

    this.searchFields.push('rule-screen.search-fields.rule-name');

  }

  loadConditionTables(): void {
    this.conditionTableColumns = new Array<TableColumn>();

    const conditionColumnType: TableColumn = {
      name: 'rule-screen.condition-columns.type',
      dataKey: 'type',
      position: 'left',
      isSortable: true,
    };

    const conditionColumnUncovered: TableColumn = {
      name: 'rule-screen.condition-columns.uncovered',
      dataKey: 'uncovered',
      position: 'left',
      isSortable: true
    };

    const conditionColumnCopies: TableColumn = {
      name: 'rule-screen.condition-columns.copies',
      dataKey: 'copies',
      position: 'left',
      isSortable: true
    };

    const conditionColumnTranscript: TableColumn = {
      name: 'rule-screen.condition-columns.transcript',
      dataKey: 'transcript',
      position: 'left',
      isSortable: true
    };

    const conditionColumnPositive: TableColumn = {
      name: 'rule-screen.condition-columns.positive',
      dataKey: 'transcript',
      position: 'left',
      isSortable: true
    };

    const conditionColumnActive: TableColumn = {
      name: 'rule-screen.condition-columns.active',
      dataKey: 'active',
      position: 'left',
      isSortable: true
    };

    const conditionColumnTargetGenesType: TableColumn = {
      name: 'rule-screen.condition-columns.target-genes-type',
      dataKey: 'targetGenesType',
      position: 'left',
      isSortable: true
    };

    const conditionColumnGeneRegion: TableColumn = {
      name: 'rule-screen.condition-columns.gene-region',
      dataKey: 'geneRegion',
      position: 'left',
      isSortable: true
    };

    const conditionColumnMutation: TableColumn = {
      name: 'rule-screen.condition-columns.mutation',
      dataKey: 'mutation',
      position: 'left',
      isSortable: true
    };

    const conditionColumnPanelVersion: TableColumn = {
      name: 'rule-screen.condition-columns.panel-version',
      dataKey: 'panelVersion',
      position: 'left',
      isSortable: true
    };

    const conditionColumnValues: TableColumn = {
      name: 'rule-screen.condition-columns.values',
      dataKey: 'values',
      position: 'left',
      isSortable: true
    };

    const conditionColumnHgvs: TableColumn = {
      name: 'rule-screen.condition-columns.hgvs',
      dataKey: 'hgvs',
      position: 'left',
      isSortable: true
    };

    const conditionColumnGenes: TableColumn = {
      name: 'rule-screen.condition-columns.genes',
      dataKey: 'genes',
      position: 'left',
      isSortable: true
    };

    const conditionColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.conditionTableColumns.push(conditionColumnType);
    this.conditionTableColumns.push(conditionColumnUncovered);
    this.conditionTableColumns.push(conditionColumnCopies);
    this.conditionTableColumns.push(conditionColumnTranscript);
    this.conditionTableColumns.push(conditionColumnPositive);
    this.conditionTableColumns.push(conditionColumnActive);
    this.conditionTableColumns.push(conditionColumnTargetGenesType);
    this.conditionTableColumns.push(conditionColumnGenes);
    this.conditionTableColumns.push(conditionColumnGeneRegion);
    this.conditionTableColumns.push(conditionColumnMutation);
    this.conditionTableColumns.push(conditionColumnPanelVersion);
    this.conditionTableColumns.push(conditionColumnValues);
    this.conditionTableColumns.push(conditionColumnHgvs);

    this.conditionTableColumns.push(conditionColumnActions);
  }

  loadActionTable(): void {
    this.actionTableColumns = new Array<TableColumn>();

    const actionColumnType: TableColumn = {
      name: 'rule-screen.action-columns.type',
      dataKey: 'type',
      position: 'left',
      isSortable: true
    };

    const actionColumnUncovered: TableColumn = {
      name: 'rule-screen.action-columns.uncovered',
      dataKey: 'uncovered',
      position: 'left',
      isSortable: true
    };

    const actionColumnHgvs: TableColumn = {
      name: 'rule-screen.action-columns.hgvs',
      dataKey: 'hgvs',
      position: 'left',
      isSortable: true
    };

    const actionColumnGeneRegion: TableColumn = {
      name: 'rule-screen.action-columns.gene-region',
      dataKey: 'geneRegion',
      position: 'left',
      isSortable: true
    };

    const actionColumnRuleMatchResultWarning: TableColumn = {
      name: 'rule-screen.action-columns.rule-warning',
      dataKey: 'ruleMatchResultWarning',
      position: 'left',
      isSortable: true
    };

    const actionColumnActions: TableColumn = {
      name: 'Actions',
      dataKey: 'actions',
      position: 'right',
      isSortable: false
    };

    this.actionTableColumns.push(actionColumnType);
    this.actionTableColumns.push(actionColumnRuleMatchResultWarning);
    this.actionTableColumns.push(actionColumnUncovered);
    this.actionTableColumns.push(actionColumnHgvs);
    this.actionTableColumns.push(actionColumnGeneRegion);
    this.actionTableColumns.push(actionColumnActions);
  }

  processListRules(): void {
    const timeout = setTimeout(() => {
      this.tableService.selectLoadingSearch(true);
    }, 1000);

    if (this.pagination.textFilter === null || this.pagination.textFilter === '') {
      const ruleArray = new Array<Rule>();
      const obs = this.ruleService.listRulesPagination(this.pagination);
      if (obs !== null && obs !== undefined) {
        if (this.rulesSubscription !== undefined) {
          this.rulesSubscription.unsubscribe();
        }
        this.rulesSubscription = obs.subscribe(
          response => {
            if (response._embedded !== undefined) {
              response._embedded[environment.linksRules].forEach(element => {

                const rule = Rule.fromObject(element);
                ruleArray.push(rule);
              });
              this.rules = ruleArray;
              this.loading = false;
              clearTimeout(timeout);
              this.tableService.selectLoadingSearch(false);
            }
            if (response.page !== undefined) {
              this.pagination.currentPag = response.page.number;
              this.pagination.numberOfPages = response.page.totalPages;
              this.pagination.totalElements = response.page.totalElements;
            }
          },
          error => {
            console.log(error);
          });
      }
    } else {
      let parameter: string;

      if (this.pagination.textField.toLowerCase() === this.translateService.instant('rule-screen.search-fields.rule-name').toLowerCase()) {
        parameter = 'name';
      }

      if (this.rulesSubscription !== undefined) {
        this.rulesSubscription.unsubscribe();
      }

      this.rulesSubscription = this.ruleService.getRuleByParameter(this.pagination, parameter).subscribe(data => {
        const ruleAux: Array<Rule> = new Array<Rule>();
        if (data._embedded !== null
          && data._embedded !== undefined
          && data._embedded[environment.linksRules] !== null
          && data._embedded[environment.linksRules] !== undefined) {
          data._embedded[environment.linksRules].forEach(element => {
            ruleAux.push(Rule.fromObject(element));
          });
        }
        if (data.page !== undefined) {
          this.pagination.currentPag = data.page.number;
          this.pagination.numberOfPages = data.page.totalPages;
          this.pagination.totalElements = data.page.totalElements;
        }
        this.rules = ruleAux;
        this.loading = false;
        clearTimeout(timeout);
        this.tableService.selectLoadingSearch(false);
      });
    }
  }

  addRule(): void {
    this.loadConditionTables();
    this.loadActionTable();

    this.editingRule = new Rule();
    this.unlockFields = false;
    this.showRecord = true;
    this.adding = true;
    this.unlockFields = true;
  }

  deleteRule(deletingRule: Rule): void {
    const dialogData = new ConfirmDialogModel(
                    'rule-screen.messages.rule-confirmation-title',
                 'rule-screen.messages.rule-deleting-question',
          'common-elements.messages.confirmation-dialog-accept',
          'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {
        console.log('Confirmed rule deletion');
        console.log('Rule screen component - deleting rule: ');

        for (const rule of this.rules) {
          if (rule._links.self.href === deletingRule._links.self.href) {
            try {
              this.deleteRuleSubscription = this.ruleService.deleteRule(rule).subscribe(
                  (deletedRuleData) => {
                    this.rules = this.rules.filter(
                        ruleFiltered => (
                          rule._links.self !== ruleFiltered._links.self
                        )
                    );
                    this.showNotification('rule-screen.messages.rule-deleted', 'notification-class');
                  },
                  error => {
                    console.log('Error caught: ' + error);
                    this.showNotification('rule-screen.messages.rule-not-saved', 'notification-class-warn');
                  }
              );
            } catch (e) {
              console.log('');
              this.showNotification('rule-screen.messages.rule-not-saved', 'notification-class-warn');
            }
          }
        }
      } else {
        console.log('Canceled rule deletion');
      }
    });
  }

  sortRules(event: any): void {
    this.pagination.currentPag = 0; // Go to the first page
    if (event !== null && event !== undefined) {
      this.pagination.sortField = event.active;
      this.pagination.sortOrder = event.direction;
    }
    this.processListRules();
  }

  editButton(): void {
    this.unlockFields = true;
  }

  recordButton(): void {
    this.unlockFields = false;
  }

  backButton(): void {
    this.showRecord = false;
    this.adding = false;
    this.creating = false;

    this.processListRules();
  }

  copyRequestValues(copyFromRule: Rule, toRule: Rule): void {
    toRule.name = copyFromRule.name;
    toRule._links = copyFromRule._links;
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.totalElements = event.length;
      this.pagination.currentPag = event.pageIndex;
      this.pagination.currentPagSize = event.pageSize;
    }
    this.processListRules();
  }

  textFiltered(event): void {
    if (event !== null && event !== undefined) {
      this.pagination.textFilter = event.target.value;
      this.pagination.currentPag = 0;
      this.pagination.textField = event.field;
    }
    this.processListRules();
  }

  showRuleRecord(rule: Rule): void {
    this.loadConditionTables();
    this.loadActionTable();

    this.editingRule = rule;
    this.unlockFields = false;
    this.showRecord = true;

    let actionObservable;
    let conditionGroupAObservable;
    let conditionGroupBObservable;

    this.editingActions = new Array<Action>();

    if (rule._links['precon:actions'] !== undefined &&
        rule._links['precon:actions'].href !== undefined) {
      actionObservable = this.ruleService.getActionsFromRule(rule);
    } else {
      const halObject = new HalObject();
      halObject._embedded = new Array<Action>();
      actionObservable = of(halObject);
    }

    if (rule._links['precon:ruleConditionGroupA'] !== undefined &&
        rule._links['precon:ruleConditionGroupA'].href !== undefined) {
      conditionGroupAObservable = this.ruleService.getConditionGroupAFromRule(rule);
    } else {
      conditionGroupAObservable = of(new RuleConditionGroup());
    }

    if (rule._links['precon:ruleConditionGroupB'] !== undefined &&
        rule._links['precon:ruleConditionGroupB'].href !== undefined) {
      conditionGroupBObservable = this.ruleService.getConditionGroupBFromRule(rule);
    } else {
      conditionGroupBObservable = of(new RuleConditionGroup());
    }

    this.editingRuleSubscription = forkJoin({
      actionData: actionObservable,
      conditionGroupAData: conditionGroupAObservable,
      conditionGroupBData: conditionGroupBObservable
    }).subscribe(({
      actionData,
      conditionGroupAData,
      conditionGroupBData
    }) => {
      console.log('RETRIEVED ACTIONS AND CONDITION GROUPS');

      const actionList = new Array<Action>();
      const halObjectAction = actionData as HalObject;

      if (halObjectAction._embedded[environment.linksActionNotSuitable] !== undefined) {
        halObjectAction._embedded[environment.linksActionNotSuitable].forEach(element => {
          actionList.push(Action.fromObject(element));
        });
      }

      if (halObjectAction._embedded[environment.linksActionXChromo] !== undefined) {
        halObjectAction._embedded[environment.linksActionXChromo].forEach(element => {
          actionList.push(Action.fromObject(element));
        });
      }

      if (halObjectAction._embedded[environment.linksActionXChromoNoNgs] !== undefined) {
        halObjectAction._embedded[environment.linksActionXChromoNoNgs].forEach(element => {
          actionList.push(Action.fromObject(element));
        });
      }

      if (halObjectAction._embedded[environment.linksActionNotMatcheable] !== undefined) {
        halObjectAction._embedded[environment.linksActionNotMatcheable].forEach(element => {
          actionList.push(Action.fromObject(element));
        });
      }

      if (halObjectAction._embedded[environment.linksActionWarning] !== undefined) {
        halObjectAction._embedded[environment.linksActionWarning].forEach(element => {
          actionList.push(Action.fromObject(element));
        });
      }

      this.editingActions = actionList;

      const conditionGroupA = conditionGroupAData as RuleConditionGroup;
      const conditionGroupB = conditionGroupBData as RuleConditionGroup;

      this.obtainConditions(conditionGroupA, conditionGroupB);
    });

  }

  obtainConditions(groupA: RuleConditionGroup, groupB: RuleConditionGroup): void {
    this.editingConditionsSubscription = this.ruleService.getConditionsFromGroup(groupA).subscribe(conditionsAData => {
      console.log('RECOVERING CONDITIONS A');
      const conditionsA = new Array<Condition>();

      const halObjectA = conditionsAData as HalObject;

      if (halObjectA._embedded[environment.linksConditionCnv] !== undefined) {
          halObjectA._embedded[environment.linksConditionCnv].forEach(element => {
          console.log('RECOVERED CONDITION CNV');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionNoNgs] !== undefined) {
        halObjectA._embedded[environment.linksConditionNoNgs].forEach(element => {
          console.log('RECOVERED CONDITION NO NGS');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionPolyT] !== undefined) {
        halObjectA._embedded[environment.linksConditionPolyT].forEach(element => {
          console.log('RECOVERED CONDITION POLY T');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionPanel] !== undefined) {
        halObjectA._embedded[environment.linksConditionPanel].forEach(element => {
          console.log('RECOVERED CONDITION PANEL');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionContains] !== undefined) {
        halObjectA._embedded[environment.linksConditionContains].forEach(element => {
          console.log('RECOVERED CONDITION CONTAINS');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionVariant] !== undefined) {
        halObjectA._embedded[environment.linksConditionVariant].forEach(element => {
          console.log('RECOVERED CONDITION VARIANT');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionCarrier] !== undefined) {
        halObjectA._embedded[environment.linksConditionCarrier].forEach(element => {
          console.log('RECOVERED CONDITION CARRIER');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      if (halObjectA._embedded[environment.linksConditionEmptyPolyT] !== undefined) {
        halObjectA._embedded[environment.linksConditionEmptyPolyT].forEach(element => {
          console.log('RECOVERED CONDITION EMPTY POLY T');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsA.push(conditionElement);
        });
      }

      this.editingConditionsA = conditionsA;
    });


    this.editingConditionsSubscription = this.ruleService.getConditionsFromGroup(groupB).subscribe(conditionsBData => {
      console.log('RECOVERING CONDITIONS A');
      const conditionsB = new Array<Condition>();

      const halObjectB = conditionsBData as HalObject;

      if (halObjectB._embedded[environment.linksConditionCnv] !== undefined) {
          halObjectB._embedded[environment.linksConditionCnv].forEach(element => {
          console.log('RECOVERED CONDITION CNV');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionNoNgs] !== undefined) {
          halObjectB._embedded[environment.linksConditionNoNgs].forEach(element => {
          console.log('RECOVERED CONDITION NO NGS');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionPolyT] !== undefined) {
          halObjectB._embedded[environment.linksConditionPolyT].forEach(element => {
          console.log('RECOVERED CONDITION POLY T');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionPanel] !== undefined) {
          halObjectB._embedded[environment.linksConditionPanel].forEach(element => {
          console.log('RECOVERED CONDITION PANEL');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionContains] !== undefined) {
          halObjectB._embedded[environment.linksConditionContains].forEach(element => {
          console.log('RECOVERED CONDITION CONTAINS');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionVariant] !== undefined) {
          halObjectB._embedded[environment.linksConditionVariant].forEach(element => {
          console.log('RECOVERED CONDITION VARIANT');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionCarrier] !== undefined) {
          halObjectB._embedded[environment.linksConditionCarrier].forEach(element => {
          console.log('RECOVERED CONDITION CARRIER');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      if (halObjectB._embedded[environment.linksConditionEmptyPolyT] !== undefined) {
          halObjectB._embedded[environment.linksConditionEmptyPolyT].forEach(element => {
          console.log('RECOVERED CONDITION EMPTY POLY T');
          const conditionElement = Condition.fromObject(element);
          this.setConditionGene(conditionElement);
          conditionsB.push(conditionElement);
        });
      }

      this.editingConditionsB = conditionsB;
    });

    //
    // if (groupA._links['precon:conditions'] !== undefined &&
    //     groupA._links['precon:conditions'].href !== undefined) {
    //   conditionsAObservable = this.ruleService.getConditionsFromGroup(groupA).subscribe();
    // } else {
    //   console.log('Found mutations href undefined');
    //   const halObject = new HalObject();
    //   halObject._embedded = new Array<Condition>();
    //   conditionsAObservable = of(halObject);
    // }
    //
    // if (groupB._links['precon:conditions'] !== undefined &&
    //     groupA._links['precon:conditions'].href !== undefined) {
    //   conditionsBObservable = this.ruleService.getConditionsFromGroup(groupB).subscribe();
    // } else {
    //   console.log('Found mutations href undefined');
    //   const halObject = new HalObject();
    //   halObject._embedded = new Array<Condition>();
    //   conditionsBObservable = of(halObject);
    // }
    //
    //
    //
    // this.editingConditionsSubscription = forkJoin({
    //   conditionsAData: conditionsAObservable,
    //   conditionsBData: conditionsBObservable
    // }).subscribe(({
    //   conditionsAData,
    //   conditionsBData
    // }) => {
    //   const conditionsA = new Array<Condition>();
    //   const conditionsB = new Array<Condition>();
    //
    //
    //
    //   const halObjectB = conditionsBData as HalObject;
    //
    //   if (halObjectB._embedded[environment.linksConditionCnv] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionCnv].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //   if (halObjectB._embedded[environment.linksConditionNoNgs] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionNoNgs].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //
    //   if (halObjectB._embedded[environment.linksConditionPolyT] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionPolyT].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //
    //   if (halObjectB._embedded[environment.linksConditionPanel] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionPanel].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //
    //   if (halObjectB._embedded[environment.linksConditionContains] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionContains].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //   if (halObjectB._embedded[environment.linksConditionVariant] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionVariant].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    //
    //   if (halObjectB._embedded[environment.linksConditionCarrier] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionCarrier].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsA.push(conditionElement);
    //     });
    //   }
    //
    //   if (halObjectB._embedded[environment.linksConditionEmptyPolyT] !== undefined) {
    //       halObjectB._embedded[environment.linksConditionEmptyPolyT].forEach(element => {
    //       const conditionElement = Condition.fromObject(element);
    //       this.setConditionGene(conditionElement);
    //       conditionsB.push(conditionElement);
    //     });
    //   }
    // });
  }

  saveRule(): void {

  }

  // CONDITION A
  addConditionA(): void {
    const dialogData = {
      isCondition: true,
      isConditionA: true,
      dialogConditionType: undefined,
      conditionSelected: undefined,
      actionSelected: undefined
    };

    this.openRuleDialog(dialogData);
  }

  addConditionB(): void {
    const dialogData = {
      isCondition: true,
      isConditionA: false,
      dialogConditionType: undefined,
      conditionSelected: undefined,
      actionSelected: undefined
    };

    this.openRuleDialog(dialogData);
  }

  addAction(): void {
    const dialogData = {
      isCondition: false,
      isConditionA: true,
      dialogConditionType: undefined,
      conditionSelected: undefined,
      actionSelected: undefined
    };

    this.openRuleDialog(dialogData);
  }

  editConditionA(condition: Condition): void {
    const dialogData = {
      isCondition: true,
      isConditionA: true,
      dialogConditionType: undefined,
      conditionSelected: condition,
      actionSelected: undefined
    };

    this.openRuleDialog(dialogData);
  }

  editConditionB(condition: Condition): void {
    const dialogData = {
      isCondition: true,
      isConditionA: false,
      dialogConditionType: undefined,
      conditionSelected: condition,
      actionSelected: undefined
    };

    this.openRuleDialog(dialogData);
  }

  editAction(action: Action): void {
    const dialogData = {
      isCondition: false,
      isConditionA: true,
      dialogConditionType: undefined,
      conditionSelected: undefined,
      actionSelected: action
    };

    this.openRuleDialog(dialogData);
  }

  deleteCondition(deletingCondition: Condition, group: string): void {
    const dialogData = new ConfirmDialogModel(
      'rule-screen.messages.rule-confirmation-title',
      'rule-screen.messages.condition-deleting-question',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {
        console.log('Confirmed rule deletion');
        console.log('Rule screen component - deleting rule: ');

        let searchGroup: Array<Condition>;

        if (group === this.GROUP_A){
          searchGroup =  this.editingConditionsA;
        } else if (group === this.GROUP_B){
          searchGroup =  this.editingConditionsB;
        }

        for (const condition of searchGroup) {
          if (condition._links.self.href === deletingCondition._links.self.href) {
            try {
              this.deleteRuleSubscription = this.ruleService.deleteCondition(condition).subscribe(
                () => {
                  if (group === this.GROUP_A){
                    this.editingConditionsA = this.editingConditionsA.filter(
                      conditionFiltered => (
                        condition._links.self !== conditionFiltered._links.self
                      )
                    );
                  } else if (group === this.GROUP_B){
                    this.editingConditionsB = this.editingConditionsB.filter(
                      ruleFiltered => (
                        condition._links.self !== ruleFiltered._links.self
                      )
                    );
                  }
                  this.showNotification('rule-screen.messages.condition-deleted', 'notification-class');
                },
                error => {
                  console.log('Error caught: ' + error);
                  this.showNotification(error, 'notification-class-warn');
                }
              );
            } catch (e) {
              this.showNotification('rule-screen.messages.condition-not-saved', 'notification-class-warn');
            }
          }
        }
      } else {
        console.log('Canceled rule deletion');
      }
    });
  }

  deleteAction(deletingAction: Action): void {
    const dialogData = new ConfirmDialogModel(
      'rule-screen.messages.rule-confirmation-title',
      'rule-screen.messages.action-deleting-question',
      'common-elements.messages.confirmation-dialog-accept',
      'common-elements.messages.confirmation-dialog-cancel');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult as boolean;
      if (this.dialogResult) {
        console.log('Confirmed action deletion');
        console.log('Rule screen component - deleting action: ');

        for (const action of this.editingActions) {
          if (action._links.self.href === deletingAction._links.self.href) {
            try {
              this.deleteRuleSubscription = this.ruleService.deleteAction(action).subscribe(
                () => {
                  this.editingActions = this.editingActions.filter(
                    actionFiltered => (
                      action._links.self !== actionFiltered._links.self
                    )
                  );
                  this.showNotification('rule-screen.messages.action-deleted', 'notification-class');
                },
                error => {
                  console.log('Error caught: ' + error);
                  this.showNotification(error, 'notification-class-warn');
                }
              );
            } catch (e) {
              this.showNotification('rule-screen.messages.action-not-saved', 'notification-class-warn');
            }
          }
        }
      } else {
        console.log('Canceled action deletion');
      }
    });
  }

  openRuleDialog(dialogData: RuleDialogData): void {
    const dialogRef = this.dialog.open(RuleScreenDialogComponent, {
      width: '60%',
      height: '60%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      const dialogDataResult = result as RuleDialogData;
      if (dialogDataResult.actionSelected !== undefined) {
        console.log('Action selected: ' + dialogDataResult.actionSelected.type);
      }

      if (dialogDataResult.conditionSelected !== undefined) {
        if (dialogDataResult.isConditionA) {
          console.log('Condition selected, GROUP A: ' + dialogDataResult.conditionSelected.type);
        } else {
          console.log('Condition selected, GROUP B: ' + dialogDataResult.conditionSelected.type);
        }
      }
    });
  }

  setConditionGene(condition: Condition): void {
    console.log('SEARCHING GENE FOR CONDITION');
    if (this.conditionGeneSubscription !== undefined) {
      this.conditionGeneSubscription.unsubscribe();
    }

    if (condition._links['precon:gene'] !== undefined &&
        condition._links['precon:gene'].href !== undefined) {
      console.log('FOUND SINGLE GENE LINK');
      this.conditionGeneSubscription = this.ruleService.getGeneFromCondition(condition).subscribe(geneData => {
        condition.genes = new Array<Gene>();
        const geneElement = geneData as Gene;
        const gene = Gene.fromObject(geneElement);
        condition.genes.push(gene);
        console.log('FOUND GENES');
      });
    }

    if (condition._links['precon:genes'] !== undefined &&
        condition._links['precon:genes'].href !== undefined) {
      console.log('FOUND MULTIPLE GENE LINK');
      this.conditionGeneSubscription = this.ruleService.getGenesFromCondition(condition).subscribe(genesData => {
        condition.genes = new Array<Gene>();
        const halObject = genesData as HalObject;

        const geneList = halObject._embedded['precon:genes'] as Array<Gene>;
        for (const gene of geneList) {
          condition.genes.push(Gene.fromObject(gene));
        }
      });
    }
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  preventPanelMovement(event: Event): void {
      event.stopPropagation();
      event.stopImmediatePropagation();
  }
}
