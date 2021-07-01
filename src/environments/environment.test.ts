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
  testAuthToken: '',

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
  linksRelevantMutation: 'precon:relevant-found-mutations',
  linksGenotype: 'precon:genotype',
  linksRisks: 'precon:risks',
  linksStudiedMutation: 'precon:studiedMutationModelList',
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
