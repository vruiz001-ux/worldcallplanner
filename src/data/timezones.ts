export interface CityTimezone {
  id: string;
  city: string;
  region: string;
  timezone: string;
}

// Region mapping from IANA prefix
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

function formatCityName(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .replace(/\//g, ' / ');
}

function buildCityList(): CityTimezone[] {
  const allTimezones = Intl.supportedValuesOf('timeZone');

  return allTimezones
    .filter(tz => {
      // Skip generic/legacy zones
      const parts = tz.split('/');
      return parts.length >= 2 && REGION_LABELS[parts[0]];
    })
    .map(tz => {
      const parts = tz.split('/');
      const region = REGION_LABELS[parts[0]] || parts[0];
      // City is the last segment (handles America/Argentina/Buenos_Aires)
      const cityRaw = parts[parts.length - 1];
      const city = formatCityName(cityRaw);

      return {
        id: tz, // use IANA name as ID directly
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
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export function getCityById(id: string): CityTimezone | undefined {
  return CITIES.find(c => c.id === id);
}
