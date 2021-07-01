import { Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pagination, RuleDialogData } from '../../../models/common-model';
import { Action, Condition, Gene } from '../../../models/genetic-model';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rule-screen-dialog',
  templateUrl: './rule-screen-dialog.component.html',
  styleUrls: ['./rule-screen-dialog.component.scss']
})
export class RuleScreenDialogComponent implements OnInit, OnDestroy {
  conditionCarrierGene = 'CONDITION_CARRIER_GENE';
  conditionCNV = 'CONDITION_CNV';
  conditionContains = 'CONDITION_CONTAINS';
  conditionNoNgs = 'CONDITION_NO_NGS';
  conditionPanel = 'CONDITION_PANEL';
  conditionEmptyPolyT = 'CONDITION_EMPTY_POLY_T';
  conditionPolyT = 'CONDITION_POLY_T';
  conditionVariant = 'CONDITION_VARIANT';

  actionNotMatcheable = 'ACTION_NOT_MATCHEABLE';
  actionSuitableGenes = 'ACTION_SUITABLE_GENES';
  actionWarning = 'ACTION_WARNING';
  actionXChromo = 'ACTION_X_CHROMO';
  actionXChromoNoNGS = 'ACTION_X_CHROMO_NO_NGS';

  isCondition: boolean;

  condition: Condition;
  conditionOptions: Array<string>;
  selectedConditionType: string;

  action: Action;
  actionOptions: Array<string>;
  selectedActionType: string;

  pagination: Pagination;

  genes: Array<Gene>;
  genesObservable: Observable<Array<Gene>>;
  geneSubscription: Subscription;
  geneFormControl: FormControl;

  loading: boolean;

  languages: Array<string>;
  selectedLanguage: string;

  constructor(
    public dialogRef: MatDialogRef<RuleScreenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleDialogData,
    public translateService: TranslateService) {}

  ngOnInit(): void {
    this.languages = new Array<string>();
    if (this.translateService.currentLang === undefined) {
      this.languages.push('es');
      this.selectedLanguage = 'es';
    } else {
      this.languages.push(this.translateService.currentLang.toLowerCase());
      this.selectedLanguage = this.translateService.currentLang.toLowerCase();
    }

    this.pagination = new Pagination();
    this.genes = new Array<Gene>();
    this.genesObservable = of(this.genes);
    this.loading = false;
    this.geneFormControl = new FormControl();

    if (this.data.isCondition) {
      this.conditionOptions = new Array<string>();
      this.conditionOptions.push(this.conditionCarrierGene);
      this.conditionOptions.push(this.conditionCNV);
      this.conditionOptions.push(this.conditionContains);
      this.conditionOptions.push(this.conditionNoNgs);
      this.conditionOptions.push(this.conditionPanel);
      this.conditionOptions.push(this.conditionEmptyPolyT);
      this.conditionOptions.push(this.conditionPolyT);
      this.conditionOptions.push(this.conditionVariant);

      if (this.data.conditionSelected === undefined) {
        this.data.conditionSelected = new Condition();
      }
    } else {
      this.actionOptions = new Array<string>();
      this.actionOptions.push(this.actionNotMatcheable);
      this.actionOptions.push(this.actionSuitableGenes);
      this.actionOptions.push(this.actionWarning);
      this.actionOptions.push(this.actionXChromo);
      this.actionOptions.push(this.actionXChromoNoNGS);

      if (this.data.actionSelected === undefined) {
        this.data.actionSelected = new Action();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.geneSubscription !== undefined)  {
      this.geneSubscription.unsubscribe();
    }
  }

  acceptButton(): void {
    if (this.selectedConditionType !== undefined) {
      this.data.conditionSelected.type = this.selectedConditionType;
    }

    if (this.selectedActionType !== undefined) {
      this.data.actionSelected.type = this.selectedActionType;
    }

    this.dialogRef.close(this.data);
  }

  cancelButton(): void {
    this.dialogRef.close();
  }

}
