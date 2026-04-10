export interface CityTimezone {
  id: string;
  city: string;
  region: string;
  timezone: string;
}

const REGION_LABELS: Record<string, string> = {
  'Africa': 'Africa',
  'America': 'Americas',
  'Antarctica': 'Antarctica',
  'Arctic': 'Arctic',
  'Asia': 'Asia',
  'Atlantic': 'Atlantic',
  'Australia': 'Australia',
  'Europe': 'Europe',
  'Indian': 'Indian Ocean',
  'Pacific': 'Pacific',
};

// Rename legacy/confusing IANA city names to modern names
const CITY_RENAMES: Record<string, string> = {
  'Calcutta': 'Kolkata',
  'Bombay': 'Mumbai',
  'Madras': 'Chennai',
  'Saigon': 'Ho Chi Minh',
  'Rangoon': 'Yangon',
  'Dacca': 'Dhaka',
  'Katmandu': 'Kathmandu',
  'Ujung_Pandang': 'Makassar',
  'Ulan_Bator': 'Ulaanbaatar',
  'Faeroe': 'Faroe',
  'Asmera': 'Asmara',
};

function formatCityName(raw: string): string {
  const renamed = CITY_RENAMES[raw] || raw;
  return renamed.replace(/_/g, ' ');
}

function buildCityList(): CityTimezone[] {
  const allTimezones = Intl.supportedValuesOf('timeZone');

  return allTimezones
    .filter(tz => {
      const parts = tz.split('/');
      return parts.length >= 2 && REGION_LABELS[parts[0]];
    })
    .map(tz => {
      const parts = tz.split('/');
      const region = REGION_LABELS[parts[0]] || parts[0];
      const cityRaw = parts[parts.length - 1];
      const city = formatCityName(cityRaw);

      return {
        id: tz,
        city,
        region,
        timezone: tz,
      };
    })
    .sort((a, b) => a.city.localeCompare(b.city));
}

export const CITIES: CityTimezone[] = buildCityList();

export const DEFAULT_CITY_IDS = [
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Calcutta',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export function getCityById(id: string): CityTimezone | undefined {
  return CITIES.find(c => c.id === id);
}
