export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Admin1Filter = {
  AND?: InputMaybe<Admin1Filter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<Admin1Filter>;
  OR?: InputMaybe<Admin1Filter>;
  id?: InputMaybe<IdBaseFilterLookup>;
};

export type Admin1Order = {
  id?: InputMaybe<Ordering>;
};

export type Admin1Type = {
  __typename?: 'Admin1Type';
  country: CountryType;
  countryId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isUnknown: Scalars['Boolean']['output'];
  maxLatitude?: Maybe<Scalars['String']['output']>;
  maxLongitude?: Maybe<Scalars['String']['output']>;
  minLatitude?: Maybe<Scalars['String']['output']>;
  minLongitude?: Maybe<Scalars['String']['output']>;
  multipolygon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  polygon?: Maybe<Scalars['String']['output']>;
};

export type Admin1TypeCountList = {
  __typename?: 'Admin1TypeCountList';
  count: Scalars['Int']['output'];
  items: Array<Admin1Type>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type AlertFilter = {
  AND?: InputMaybe<AlertFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AlertFilter>;
  OR?: InputMaybe<AlertFilter>;
  admin1?: InputMaybe<Scalars['ID']['input']>;
  category?: InputMaybe<Array<AlertInfoCategoryEnum>>;
  certainty?: InputMaybe<Array<AlertInfoCertaintyEnum>>;
  country?: InputMaybe<DjangoModelFilterInput>;
  id?: InputMaybe<IdBaseFilterLookup>;
  region?: InputMaybe<Scalars['ID']['input']>;
  sent?: InputMaybe<DatetimeDatetimeFilterLookup>;
  severity?: InputMaybe<Array<AlertInfoSeverityEnum>>;
  urgency?: InputMaybe<Array<AlertInfoUrgencyEnum>>;
};

export type AlertInfoAreaCircleType = {
  __typename?: 'AlertInfoAreaCircleType';
  alertInfoAreaId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type AlertInfoAreaGeocodeType = {
  __typename?: 'AlertInfoAreaGeocodeType';
  alertInfoAreaId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
  valueName: Scalars['String']['output'];
};

export type AlertInfoAreaPolygonType = {
  __typename?: 'AlertInfoAreaPolygonType';
  alertInfoAreaId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type AlertInfoAreaType = {
  __typename?: 'AlertInfoAreaType';
  alertInfoId: Scalars['ID']['output'];
  altitude?: Maybe<Scalars['String']['output']>;
  areaDesc: Scalars['String']['output'];
  ceiling?: Maybe<Scalars['String']['output']>;
  circles: Array<AlertInfoAreaCircleType>;
  geocodes: Array<AlertInfoAreaGeocodeType>;
  id: Scalars['ID']['output'];
  polygons: Array<AlertInfoAreaPolygonType>;
};

export enum AlertInfoCategoryEnum {
  Cbrne = 'CBRNE',
  Env = 'ENV',
  Fire = 'FIRE',
  Geo = 'GEO',
  Health = 'HEALTH',
  Infra = 'INFRA',
  Met = 'MET',
  Other = 'OTHER',
  Rescue = 'RESCUE',
  Safety = 'SAFETY',
  Security = 'SECURITY',
  Transport = 'TRANSPORT'
}

export enum AlertInfoCertaintyEnum {
  Likely = 'LIKELY',
  Observed = 'OBSERVED',
  Possible = 'POSSIBLE',
  Unknown = 'UNKNOWN',
  Unlikely = 'UNLIKELY'
}

export type AlertInfoFilter = {
  AND?: InputMaybe<AlertInfoFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<AlertInfoFilter>;
  OR?: InputMaybe<AlertInfoFilter>;
  id?: InputMaybe<IdBaseFilterLookup>;
};

export type AlertInfoOrder = {
  id?: InputMaybe<Ordering>;
};

export type AlertInfoParameterType = {
  __typename?: 'AlertInfoParameterType';
  alertInfoId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
  valueName: Scalars['String']['output'];
};

export enum AlertInfoResponseTypeEnum {
  Allclear = 'ALLCLEAR',
  Assess = 'ASSESS',
  Avoid = 'AVOID',
  Evacuate = 'EVACUATE',
  Execute = 'EXECUTE',
  Monitor = 'MONITOR',
  None = 'NONE',
  Prepare = 'PREPARE',
  Shelter = 'SHELTER'
}

export enum AlertInfoSeverityEnum {
  Extreme = 'EXTREME',
  Minor = 'MINOR',
  Moderate = 'MODERATE',
  Severe = 'SEVERE',
  Unknown = 'UNKNOWN'
}

export type AlertInfoType = {
  __typename?: 'AlertInfoType';
  alertId: Scalars['ID']['output'];
  areas: Array<AlertInfoAreaType>;
  audience?: Maybe<Scalars['String']['output']>;
  category: AlertInfoCategoryEnum;
  categoryDisplay: Scalars['String']['output'];
  certainty: AlertInfoCertaintyEnum;
  certaintyDisplay: Scalars['String']['output'];
  contact?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  effective: Scalars['DateTime']['output'];
  event: Scalars['String']['output'];
  eventCode?: Maybe<Scalars['String']['output']>;
  expires?: Maybe<Scalars['DateTime']['output']>;
  headline?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instruction?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  onset?: Maybe<Scalars['DateTime']['output']>;
  parameter?: Maybe<Scalars['String']['output']>;
  parameters: Array<AlertInfoParameterType>;
  responseType?: Maybe<AlertInfoResponseTypeEnum>;
  responseTypeDisplay?: Maybe<Scalars['String']['output']>;
  senderName?: Maybe<Scalars['String']['output']>;
  severity: AlertInfoSeverityEnum;
  severityDisplay: Scalars['String']['output'];
  urgency: AlertInfoUrgencyEnum;
  urgencyDisplay: Scalars['String']['output'];
  web?: Maybe<Scalars['String']['output']>;
};

export type AlertInfoTypeCountList = {
  __typename?: 'AlertInfoTypeCountList';
  count: Scalars['Int']['output'];
  items: Array<AlertInfoType>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export enum AlertInfoUrgencyEnum {
  Expected = 'EXPECTED',
  Future = 'FUTURE',
  Immediate = 'IMMEDIATE',
  Past = 'PAST',
  Unknown = 'UNKNOWN'
}

export enum AlertMsgTypeEnum {
  Ack = 'ACK',
  Alert = 'ALERT',
  Cancel = 'CANCEL',
  Error = 'ERROR',
  Update = 'UPDATE'
}

export type AlertOrder = {
  id?: InputMaybe<Ordering>;
};

export enum AlertStatusEnum {
  Actual = 'ACTUAL',
  Draft = 'DRAFT',
  Exercise = 'EXERCISE',
  System = 'SYSTEM',
  Test = 'TEST'
}

export type AlertType = {
  __typename?: 'AlertType';
  addresses?: Maybe<Scalars['String']['output']>;
  admin1s: Array<Admin1Type>;
  code?: Maybe<Scalars['String']['output']>;
  country: CountryType;
  countryId: Scalars['ID']['output'];
  feed: FeedType;
  feedId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  incidents?: Maybe<Scalars['String']['output']>;
  infos: Array<AlertInfoType>;
  msgType: AlertMsgTypeEnum;
  msgTypeDisplay: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Scalars['String']['output']>;
  restriction?: Maybe<Scalars['String']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  sender: Scalars['String']['output'];
  sent: Scalars['DateTime']['output'];
  source?: Maybe<Scalars['String']['output']>;
  status: AlertStatusEnum;
  statusDisplay: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type AlertTypeCountList = {
  __typename?: 'AlertTypeCountList';
  count: Scalars['Int']['output'];
  items: Array<AlertType>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type AppEnumCollection = {
  __typename?: 'AppEnumCollection';
  AlertInfoCategory: Array<AppEnumCollectionAlertInfoCategory>;
  AlertInfoCertainty: Array<AppEnumCollectionAlertInfoCertainty>;
  AlertInfoResponseType: Array<AppEnumCollectionAlertInfoResponseType>;
  AlertInfoSeverity: Array<AppEnumCollectionAlertInfoSeverity>;
  AlertInfoUrgency: Array<AppEnumCollectionAlertInfoUrgency>;
  AlertMsgType: Array<AppEnumCollectionAlertMsgType>;
  AlertStatus: Array<AppEnumCollectionAlertStatus>;
  FeedFormat: Array<AppEnumCollectionFeedFormat>;
  FeedPollingInterval: Array<AppEnumCollectionFeedPollingInterval>;
  FeedStatus: Array<AppEnumCollectionFeedStatus>;
  UserEmailOptOuts: Array<AppEnumCollectionUserEmailOptOuts>;
};

export type AppEnumCollectionAlertInfoCategory = {
  __typename?: 'AppEnumCollectionAlertInfoCategory';
  key: AlertInfoCategoryEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertInfoCertainty = {
  __typename?: 'AppEnumCollectionAlertInfoCertainty';
  key: AlertInfoCertaintyEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertInfoResponseType = {
  __typename?: 'AppEnumCollectionAlertInfoResponseType';
  key: AlertInfoResponseTypeEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertInfoSeverity = {
  __typename?: 'AppEnumCollectionAlertInfoSeverity';
  key: AlertInfoSeverityEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertInfoUrgency = {
  __typename?: 'AppEnumCollectionAlertInfoUrgency';
  key: AlertInfoUrgencyEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertMsgType = {
  __typename?: 'AppEnumCollectionAlertMsgType';
  key: AlertMsgTypeEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionAlertStatus = {
  __typename?: 'AppEnumCollectionAlertStatus';
  key: AlertStatusEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionFeedFormat = {
  __typename?: 'AppEnumCollectionFeedFormat';
  key: FeedFormatEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionFeedPollingInterval = {
  __typename?: 'AppEnumCollectionFeedPollingInterval';
  key: FeedPoolingIntervalEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionFeedStatus = {
  __typename?: 'AppEnumCollectionFeedStatus';
  key: FeedStatusEnum;
  label: Scalars['String']['output'];
};

export type AppEnumCollectionUserEmailOptOuts = {
  __typename?: 'AppEnumCollectionUserEmailOptOuts';
  key: OptEmailNotificationTypeEnum;
  label: Scalars['String']['output'];
};

export type ContinentType = {
  __typename?: 'ContinentType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CountryFilter = {
  AND?: InputMaybe<CountryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<CountryFilter>;
  OR?: InputMaybe<CountryFilter>;
  id?: InputMaybe<IdBaseFilterLookup>;
};

export type CountryOrder = {
  id?: InputMaybe<Ordering>;
};

export type CountryType = {
  __typename?: 'CountryType';
  admin1s: Array<Admin1Type>;
  centroid?: Maybe<Scalars['String']['output']>;
  continent: ContinentType;
  continentId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  iso3: Scalars['String']['output'];
  multipolygon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  polygon?: Maybe<Scalars['String']['output']>;
  region: RegionType;
  regionId: Scalars['ID']['output'];
};

export type CountryTypeCountList = {
  __typename?: 'CountryTypeCountList';
  count: Scalars['Int']['output'];
  items: Array<CountryType>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type DatetimeDatetimeFilterLookup = {
  date?: InputMaybe<IntComparisonFilterLookup>;
  day?: InputMaybe<IntComparisonFilterLookup>;
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['DateTime']['input']>;
  /** Greater than. Filter will be skipped on `null` value */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Greater than or equal to. Filter will be skipped on `null` value */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  hour?: InputMaybe<IntComparisonFilterLookup>;
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isoWeekDay?: InputMaybe<IntComparisonFilterLookup>;
  isoYear?: InputMaybe<IntComparisonFilterLookup>;
  /** Less than. Filter will be skipped on `null` value */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Less than or equal to. Filter will be skipped on `null` value */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  minute?: InputMaybe<IntComparisonFilterLookup>;
  month?: InputMaybe<IntComparisonFilterLookup>;
  quarter?: InputMaybe<IntComparisonFilterLookup>;
  /** Inclusive range test (between) */
  range?: InputMaybe<DatetimeRangeLookup>;
  second?: InputMaybe<IntComparisonFilterLookup>;
  time?: InputMaybe<IntComparisonFilterLookup>;
  week?: InputMaybe<IntComparisonFilterLookup>;
  weekDay?: InputMaybe<IntComparisonFilterLookup>;
  year?: InputMaybe<IntComparisonFilterLookup>;
};

export type DatetimeRangeLookup = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DjangoModelFilterInput = {
  pk: Scalars['ID']['input'];
};

export type FeedFilter = {
  AND?: InputMaybe<FeedFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<FeedFilter>;
  OR?: InputMaybe<FeedFilter>;
  id?: InputMaybe<IdBaseFilterLookup>;
};

export enum FeedFormatEnum {
  Atom = 'ATOM',
  NwsUs = 'NWS_US',
  Rss = 'RSS'
}

export type FeedOrder = {
  id?: InputMaybe<Ordering>;
};

export enum FeedPoolingIntervalEnum {
  I_05 = 'I_05',
  I_10 = 'I_10',
  I_15 = 'I_15',
  I_20 = 'I_20',
  I_25 = 'I_25',
  I_30 = 'I_30',
  I_35 = 'I_35',
  I_40 = 'I_40',
  I_45 = 'I_45',
  I_50 = 'I_50',
  I_55 = 'I_55',
  I_60 = 'I_60'
}

export enum FeedStatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Testing = 'TESTING',
  Unusable = 'UNUSABLE'
}

export type FeedType = {
  __typename?: 'FeedType';
  authorEmail: Scalars['String']['output'];
  authorName: Scalars['String']['output'];
  country: CountryType;
  countryId: Scalars['ID']['output'];
  enablePolling: Scalars['Boolean']['output'];
  enableRebroadcast: Scalars['Boolean']['output'];
  format: FeedFormatEnum;
  formatDisplay: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languages: Array<LanguageInfoType>;
  notes?: Maybe<Scalars['String']['output']>;
  official: Scalars['Boolean']['output'];
  pollingInterval: FeedPoolingIntervalEnum;
  pollingIntervalDisplay: FeedPoolingIntervalEnum;
  status: Scalars['String']['output'];
  statusDisplay: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FeedTypeCountList = {
  __typename?: 'FeedTypeCountList';
  count: Scalars['Int']['output'];
  items: Array<FeedType>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type IdBaseFilterLookup = {
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['ID']['input']>;
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IntComparisonFilterLookup = {
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than. Filter will be skipped on `null` value */
  gt?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to. Filter will be skipped on `null` value */
  gte?: InputMaybe<Scalars['Int']['input']>;
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than. Filter will be skipped on `null` value */
  lt?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to. Filter will be skipped on `null` value */
  lte?: InputMaybe<Scalars['Int']['input']>;
  /** Inclusive range test (between) */
  range?: InputMaybe<IntRangeLookup>;
};

export type IntRangeLookup = {
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type LanguageInfoType = {
  __typename?: 'LanguageInfoType';
  feedId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  private: PrivateMutation;
  public: PublicMutation;
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export enum OptEmailNotificationTypeEnum {
  NewsAndOffers = 'NEWS_AND_OFFERS'
}

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type PrivateMutation = {
  __typename?: 'PrivateMutation';
  id: Scalars['ID']['output'];
};

export type PrivateQuery = {
  __typename?: 'PrivateQuery';
  id: Scalars['ID']['output'];
  noop: Scalars['ID']['output'];
};

export type PublicMutation = {
  __typename?: 'PublicMutation';
  id: Scalars['ID']['output'];
};

export type PublicQuery = {
  __typename?: 'PublicQuery';
  admin1?: Maybe<Admin1Type>;
  admin1s: Admin1TypeCountList;
  alert?: Maybe<AlertType>;
  alertInfo?: Maybe<AlertInfoType>;
  alertInfos: AlertInfoTypeCountList;
  alerts: AlertTypeCountList;
  countries: CountryTypeCountList;
  country?: Maybe<CountryType>;
  feed?: Maybe<FeedType>;
  feeds: FeedTypeCountList;
  id: Scalars['ID']['output'];
  me?: Maybe<UserMeType>;
  region?: Maybe<RegionType>;
  regions: RegionTypeCountList;
};


export type PublicQueryAdmin1Args = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryAdmin1sArgs = {
  filters?: InputMaybe<Admin1Filter>;
  order?: InputMaybe<Admin1Order>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type PublicQueryAlertArgs = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryAlertInfoArgs = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryAlertInfosArgs = {
  filters?: InputMaybe<AlertInfoFilter>;
  order?: InputMaybe<AlertInfoOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type PublicQueryAlertsArgs = {
  filters?: InputMaybe<AlertFilter>;
  order?: InputMaybe<AlertOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type PublicQueryCountriesArgs = {
  filters?: InputMaybe<CountryFilter>;
  order?: InputMaybe<CountryOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type PublicQueryCountryArgs = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryFeedArgs = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryFeedsArgs = {
  filters?: InputMaybe<FeedFilter>;
  order?: InputMaybe<FeedOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type PublicQueryRegionArgs = {
  pk: Scalars['ID']['input'];
};


export type PublicQueryRegionsArgs = {
  filters?: InputMaybe<RegionFilter>;
  order?: InputMaybe<RegionOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type Query = {
  __typename?: 'Query';
  enums: AppEnumCollection;
  private: PrivateQuery;
  public: PublicQuery;
};

export type RegionFilter = {
  AND?: InputMaybe<RegionFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
  NOT?: InputMaybe<RegionFilter>;
  OR?: InputMaybe<RegionFilter>;
  id?: InputMaybe<IdBaseFilterLookup>;
};

export type RegionOrder = {
  id?: InputMaybe<Ordering>;
};

export type RegionType = {
  __typename?: 'RegionType';
  centroid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  polygon?: Maybe<Scalars['String']['output']>;
};

export type RegionTypeCountList = {
  __typename?: 'RegionTypeCountList';
  count: Scalars['Int']['output'];
  items: Array<RegionType>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

export type UserMeType = {
  __typename?: 'UserMeType';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

export type AlertTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type AlertTypeQuery = { __typename?: 'Query', public: { __typename?: 'PublicQuery', alertInfos: { __typename?: 'AlertInfoTypeCountList', items: Array<{ __typename?: 'AlertInfoType', event: string, category: AlertInfoCategoryEnum }> }, region?: { __typename?: 'RegionType', id: string, name: string } | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, admin1s: { __typename?: 'Admin1TypeCountList', items: Array<{ __typename?: 'Admin1Type', id: string, name: string }> }, alert?: { __typename?: 'AlertType', sent: any, url: string } | null } };
