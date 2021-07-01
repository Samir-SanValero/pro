import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/authentication/auth.guard';
import { RedirectGuard } from './services/authentication/redirect.guard';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [

  // Guard to redirect to external login
  {
    path: 'externalLogin',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: { externalUrl: location.origin + '/#/login' }
  },

  { path: '', loadChildren: () => import('./modules/main-screen/main-screen.module')
                                  .then(m => m.MainScreenModule), canActivate: [AuthGuard]
  },

  { path: 'rule', loadChildren: () => import('./modules/rule-screen/rule-screen.module')
      .then(m => m.RuleScreenModule), canActivate: [AuthGuard]
  },

// MATCH_TARGET_OPTION_CUSTOM = 'custom';
// MATCH_TARGET_OPTION_PARTNER = 'partner';
// MATCH_TARGET_OPTION_BANK = 'bank';

  { path: 'customMatch/:option', loadChildren: () => import('./modules/match-screen/match-screen.module')
        .then(m => m.MatchScreenModule), canActivate: [AuthGuard]
  },

  { path: 'partnerMatch/:option', loadChildren: () => import('./modules/match-screen/match-screen.module')
      .then(m => m.MatchScreenModule), canActivate: [AuthGuard]
  },

  { path: 'bankMatch/:option', loadChildren: () => import('./modules/match-screen/match-screen.module')
      .then(m => m.MatchScreenModule), canActivate: [AuthGuard]
  },

  { path: 'group', loadChildren: () => import('./modules/group-screen/group-screen.module')
        .then(m => m.GroupScreenModule), canActivate: [AuthGuard]
  },

  { path: 'bank', loadChildren: () => import('./modules/bank-screen/bank-screen.module')
        .then(m => m.BankScreenModule), canActivate: [AuthGuard]
  },

  { path: 'request', loadChildren: () => import('./modules/request-screen/request-screen.module')
        .then(m => m.RequestScreenModule), canActivate: [AuthGuard]
  },

  { path: 'gene', loadChildren: () => import('./modules/gene-screen/gene-screen.module')
        .then(m => m.GeneScreenModule), canActivate: [AuthGuard]
  },

  { path: 'mutation', loadChildren: () => import('./modules/mutation-screen/mutation-screen.module')
        .then(m => m.MutationScreenModule), canActivate: [AuthGuard]
  },

  { path: 'cnv', loadChildren: () => import('./modules/cnv-screen/cnv-screen.module')
        .then(m => m.CnvScreenModule), canActivate: [AuthGuard]
  },

  { path: 'disease', loadChildren: () => import('./modules/disease-screen/disease-screen.module')
        .then(m => m.DiseaseScreenModule), canActivate: [AuthGuard]
  },

  { path: 'template', loadChildren: () => import('./modules/template-screen/template-screen.module')
        .then(m => m.TemplateScreenModule), canActivate: [AuthGuard]
  },

  // Wildcard to error screen
  { path: '**', loadChildren: () => import('./modules/error-screen/error-screen.module')
        .then(m => m.ErrorScreenModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule, TranslateModule]
})
export class AppRoutingModule { }

