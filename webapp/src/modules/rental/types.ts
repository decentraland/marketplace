export enum PeriodOption {
  ONE_WEEK = 'one_week',
  ONE_MONTH = 'one_month',
  TWO_MONTHS = 'two_months',
  QUARTER_YEAR = 'quarter_year',
  HALF_YEAR = 'half_year',
  ONE_YEAR = 'one_year'
}

// Just for development envs so we can test a small rental period
export const PeriodOptionsDev = {
  ONE_DAY: 'one_day',
  ...PeriodOption
}

export enum UpsertRentalOptType {
  INSERT,
  EDIT
}
