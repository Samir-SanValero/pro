export const environment = {
  // Backend Connection:
  // true: uses real backend
  // false: uses internal mock (use for unit testing)
  backendConnection: false,
  production: false,

  // Login:
  // true: uses login page and connects with real SSO to get tokens
  // false: no login, uses static value testAuthToken (use for unit testing)
  login: false,
  // When login = false only
  testAuthToken: 'eyJhbGciOiJIUzUxMiJ9.eyJsYXN0TmFtZSI6IkludGVybmFsIiwicm9sZXMiOlsiUk9MRV9JTlRFUk5BTCJdLCJncm91cElkIjoiRS0wMDk4NjMiLCJjb21wYW55TmFtZSI6Ikluc3RpdHV0byBkZSBGZWN1bmRpdGFzIiwiaXNzIjoiY29tLmdlbmVzeXN0ZW1zLmRldiIsImZpcnN0TmFtZSI6IkZlbm9tYXRjaCIsImdyb3VwTmFtZSI6IlJvYmVydG8gQ29jbyIsImNvbXBhbnlJZCI6IjJkMTZlYTBmLTMwNWQtNGNiZC1hNmM4LTNiYjFmZTExOGNlZiIsIm5iZiI6MTYyNTA2MDAyNiwibGFuZ0tleSI6ImVuIiwiaWQiOiJhOTVmMTk1OC0wMTZhLTQwZjgtYTM5Ny04YjM2ODM0NDdiYzgiLCJleHAiOjE2MjUwNjcyMjYsImlhdCI6MTYyNTA2MDAyNiwiZW1haWwiOiJmZW5vbWF0Y2hfaW50ZXJuYWxAdGVzdC5jb20iLCJhY3RpdmF0ZWQiOnRydWUsImdyb3VwQ29kZSI6IkUtMDA5ODYzIn0.EPtSQAoiqs2lDWaD8OYSI1p9cprKdGaA6jmt9koDuSCInOmyxlEMqqb2aFGeH8CDcKYsnV0ttFJJuAEGbb5z6A',

  storageToken: 'token',

  apiUrl: 'http://10.0.1.64:8091/precon/api',
  authUrl: 'http://10.0.2.16/user/api/auth/authenticate',

  // Table defaults
  groupTableDefaultPageSizes:         [20, 100, 500],
  bankTableDefaultPageSizes:          [20, 100, 500],
  requestTableDefaultPageSizes:       [20, 100, 500],
  rulesTableDefaultPageSizes:         [20, 100, 500],
  geneTableDefaultPageSizes:          [20, 100, 500],
  diseaseTableDefaultPageSizes:       [20, 100, 500],
  cnvTableDefaultPageSizes:           [20, 100, 500],
  mutationTableDefaultPageSizes:      [20, 100, 500],
  ruleTableDefaultPageSizes:          [20, 100, 500],
  templateTableDefaultPageSizes:      [20, 100, 500],

  tableSearchingTimeout: 1000,

  // LINK naming:
  embedded: '_embedded',
  links: '_links',
  page: 'page',
  self: 'self',
  href: 'href',
  setPageSize: 'size',
  setPageNumber: 'page',
  setSortOrder: 'sort',
  searchUrl: '/search/find',

  linksBanks: 'precon:banks',
  linksRequests: 'precon:requests',
  linksDisease: 'precon:disease',
  linksDiseases: 'precon:diseases',
  linksGene: 'precon:gene',
  linksGenes: 'precon:genes',
  linksCnvs: 'precon:cnvs',
  linksGroups: 'precon:groups',
  linksPermissions: 'precon:permissions',
  linksMutations: 'precon:mutations',
  linksMutationsGenes: 'precon:mutation-gene',
  linksMatchRequests: 'precon:matchRequests',
  linksMatchRequestsOption: 'precon:match-requests',
  linksRules: 'precon:rules',

  linksActions: 'precon:actions',
  linksConditionGroupA: 'precon:ruleConditionGroupA',
  linksConditionGroupB: 'precon:ruleConditionGroupB',

  linksConditionCnv: 'precon:cnvConditions',
  linksConditionNoNgs: 'precon:noNgsConditions',
  linksConditionPolyT: 'precon:polyTConditions',
  linksConditionPanel: 'precon:panelConditions',
  linksConditionContains: 'precon:containsConditions',
  linksConditionVariant: 'precon:variantConditions',
  linksConditionCarrier: 'precon:carrierConditions',
  linksConditionEmptyPolyT: 'precon:emptyPolyTConditions',

  linksActionNotSuitable: 'precon:notSuitableGenesActions',
  linksActionXChromo: 'precon:xChromoActions',
  linksActionXChromoNoNgs: 'precon:xChromoNoNgsActions',
  linksActionNotMatcheable: 'precon:notMatcheableActions',
  linksActionWarning: 'precon:warningActions',

  linksTemplates: 'precon:templates',
  linksTemplateFavourites: 'precon:template-favourites',
  linksEthnicities: 'precon:ethnicities',
  linksCountries: 'precon:countries',
  linksCommonGenes: 'precon:common-genes',
  linksSourceRequest: 'precon:sourceRequest',
  linksTargetRequest: 'precon:targetRequest',
  linksSourceCnvs: 'precon:source-cnvs',
  linksSourceFoundMutations: 'precon:source-found-mutations',
  linksSourceNoNgs: 'precon:source-no-ngs',
  linksTargetExtenalGenes: 'precon:target-external-genes',
  linksFoundMutations: 'precon:found-mutations',
  linksFound_Mutations: 'precon:found_mutations',
  linksCnvRequests: 'precon:cnv_requests',
  linksNoNgs: 'precon:no-ngs',
  linksMutationNoNgs: 'precon:mutation_no_ngs',
  linksGenotype: 'precon:genotype',
  linksRisks: 'precon:risks',
  linksStudiedMutation: 'precon:studiedMutationModelList',
  linksRelevantMutation: 'precon:relevant-found-mutations',
  linksUncovered: 'precon:uncovereds',
  linksUncoveredMutations: 'precon:uncovered_mutations',
  linksNoNgsMutations: 'precon:mutation_no_ngs',

  linkTemplateModelList: 'precon:templateModelList',
  linkAcceptedLanguages: 'precon:languages',
  linkSampleTypes: 'precon:sampleTypes',

  // INTERNATIONALIZATION
  storageLanguageKey: 'preconLang',
  langES: 'es',
  langEN: 'en'
};
