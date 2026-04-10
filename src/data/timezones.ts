export interface CityTimezone {
  id: string;
  city: string;
  country: string;
  timezone: string;
  emoji: string;
}

export const CITIES: CityTimezone[] = [
  { id: 'new-york', city: 'New York', country: 'United States', timezone: 'America/New_York', emoji: '🗽' },
  { id: 'los-angeles', city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', emoji: '🌴' },
  { id: 'chicago', city: 'Chicago', country: 'United States', timezone: 'America/Chicago', emoji: '🏙️' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', emoji: '🍁' },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', emoji: '🇲🇽' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', emoji: '🇧🇷' },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', emoji: '🇦🇷' },
  { id: 'london', city: 'London', country: 'United Kingdom', timezone: 'Europe/London', emoji: '🇬🇧' },
  { id: 'paris', city: 'Paris', country: 'France', timezone: 'Europe/Paris', emoji: '🇫🇷' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', emoji: '🇩🇪' },
  { id: 'madrid', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', emoji: '🇪🇸' },
  { id: 'rome', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', emoji: '🇮🇹' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', emoji: '🇳🇱' },
  { id: 'warsaw', city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', emoji: '🇵🇱' },
  { id: 'moscow', city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', emoji: '🇷🇺' },
  { id: 'istanbul', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', emoji: '🇹🇷' },
  { id: 'cairo', city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', emoji: '🇪🇬' },
  { id: 'johannesburg', city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', emoji: '🇿🇦' },
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', emoji: '🇰🇪' },
  { id: 'dubai', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', emoji: '🇦🇪' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', emoji: '🇮🇳' },
  { id: 'bangalore', city: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', emoji: '🇮🇳' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', emoji: '🇹🇭' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', emoji: '🇸🇬' },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', emoji: '🇭🇰' },
  { id: 'shanghai', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', emoji: '🇨🇳' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', emoji: '🇯🇵' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', emoji: '🇰🇷' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', emoji: '🇦🇺' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', emoji: '🇳🇿' },
];

export const DEFAULT_CITY_IDS = [
  'new-york',
  'london',
  'paris',
  'dubai',
  'mumbai',
  'tokyo',
  'sydney',
];

export function getCityById(id: string): CityTimezone | undefined {
  return CITIES.find(c => c.id === id);
}
