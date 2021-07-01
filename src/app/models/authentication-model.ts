export class User {
  // Constant values
  roleAdmin = 'ROLE_ADMIN';
  roleInternal = 'ROLE_INTERNAL';

  // Entity attributes
  groupId: string;
  groupCode: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roles: string[];
  langKey: string;
  activated: boolean;
  iss: string;
  iat: number;
  exp: number;
  authToken: string;

  // View attributes

  // Linked resources
}

export class Index {
  // Constant values

  // Entity attributes
  authUrl: string;

  banksUrl: string;
  banksSearchUrl: string;

  requestsUrl: string;
  requestsSearchUrl: string;

  diseasesUrl: string;
  diseasesSearchUrl: string;

  genesUrl: string;
  genesSearchUrl: string;

  cnvsUrl: string;
  cnvsSearchUrl: string;

  groupsUrl: string;
  groupsSearchUrl: string;

  mutationsUrl: string;
  mutationsSearchUrl: string;

  genotypeUrl: string;

  rulesUrl: string;
  rulesSearchUrl: string;

  conditionUrl: string;
  conditionSearchUrl: string;

  actionUrl: string;
  actionSearchUrl: string;

  templatesUrl: string;
  templateFavouritesUrl: string;
  templatesAcceptedUrl: string;
  templatesSampleTypesUrl: string;

  permissionUrl: string;
  countriesUrl: string;
  ethnicityUrl: string;
  donorRequestUrl: string;
  matchRequestUrl: string;
  matchResultUrl: string;
  foundMutationUrl: string;
  uncoveredMutationsUrl: string;
  noNgsMutationsUrl: string;
  studiedMutationsUrl: string;
  uncoveredCnvsUrl: string;
  externalGenesUrl: string;

  // View attributes

  // Linked resources
}

export class Link {
  href: string;
}

export class LoginEntity {
  username: string;
  password: string;
  token: string;
}
