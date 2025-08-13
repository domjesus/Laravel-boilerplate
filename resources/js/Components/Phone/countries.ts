/* eslint-disable */
// Minimal, maintained list of country calling codes with ISO alpha-2 and flag emoji.
// Source compiled from public domain data (E.164). Factual data; no copyright.
// Note: Several regions share a calling code; we keep distinct entries by ISO.
export type CountryDial = {
    code: string; // ISO 3166-1 alpha-2
    name: string;
    dial: string; // e.g., "+1"
    flag: string; // emoji
};

export const COUNTRIES: CountryDial[] = [
    { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
    { code: 'BS', name: 'Bahamas', dial: '+1', flag: '🇧🇸' },
    { code: 'BB', name: 'Barbados', dial: '+1', flag: '🇧🇧' },
    { code: 'AG', name: 'Antigua and Barbuda', dial: '+1', flag: '🇦🇬' },
    { code: 'AI', name: 'Anguilla', dial: '+1', flag: '🇦🇮' },
    { code: 'DM', name: 'Dominica', dial: '+1', flag: '🇩🇲' },
    { code: 'DO', name: 'Dominican Republic', dial: '+1', flag: '🇩🇴' },
    { code: 'GD', name: 'Grenada', dial: '+1', flag: '🇬🇩' },
    { code: 'GU', name: 'Guam', dial: '+1', flag: '🇬🇺' },
    { code: 'JM', name: 'Jamaica', dial: '+1', flag: '🇯🇲' },
    { code: 'KN', name: 'Saint Kitts and Nevis', dial: '+1', flag: '🇰🇳' },
    { code: 'LC', name: 'Saint Lucia', dial: '+1', flag: '🇱🇨' },
    { code: 'MS', name: 'Montserrat', dial: '+1', flag: '🇲🇸' },
    { code: 'PR', name: 'Puerto Rico', dial: '+1', flag: '🇵🇷' },
    { code: 'TT', name: 'Trinidad and Tobago', dial: '+1', flag: '🇹🇹' },
    { code: 'TC', name: 'Turks and Caicos Islands', dial: '+1', flag: '🇹🇨' },
    { code: 'VI', name: 'U.S. Virgin Islands', dial: '+1', flag: '🇻🇮' },

    { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
    { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
    { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
    { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪' },
    { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
    { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
    { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
    { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
    { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
    { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
    { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
    { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
    { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
    { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
    { code: 'PA', name: 'Panama', dial: '+507', flag: '🇵🇦' },
    { code: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
    { code: 'HT', name: 'Haiti', dial: '+509', flag: '🇭🇹' },
    { code: 'DO2', name: 'Dominican Republic (Alt)', dial: '+1', flag: '🇩🇴' },

    { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
    { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
    { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
    { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
    { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
    { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
    { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
    { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
    { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
    { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
    { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
    { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
    { code: 'CZ', name: 'Czechia', dial: '+420', flag: '🇨🇿' },
    { code: 'SK', name: 'Slovakia', dial: '+421', flag: '🇸🇰' },
    { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
    { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
    { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
    { code: 'BG', name: 'Bulgaria', dial: '+359', flag: '🇧🇬' },
    { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
    { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
    { code: 'TR', name: 'Türkiye', dial: '+90', flag: '🇹🇷' },

    { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
    { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
    { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
    { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
    { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
    { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
    { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
    { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰' },
    { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼' },
    { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
    { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
    { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
    { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵' },

    { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
    { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
    { code: 'FJ', name: 'Fiji', dial: '+679', flag: '🇫🇯' },
    { code: 'PF', name: 'French Polynesia', dial: '+689', flag: '🇵🇫' },

    { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
    { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
    { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
    { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
    { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
    { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
    { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
    { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
    { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
    { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
    { code: 'CM', name: 'Cameroon', dial: '+237', flag: '🇨🇲' },
    { code: 'CI', name: 'Côte d’Ivoire', dial: '+225', flag: '🇨🇮' },
    { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳' },
    { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },

    { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
    { code: 'IR', name: 'Iran', dial: '+98', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', dial: '+964', flag: '🇮🇶' },
    { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
    { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
    { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
    { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
    { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
    { code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
    { code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },

    // Add remaining countries as needed. The above covers most common; for exhaustive, expand this list.
];

export const findCountryByCode = (code: string) =>
    COUNTRIES.find((c) => c.code === code);

export const findCountryByDial = (dial: string) =>
    COUNTRIES.find((c) => c.dial === dial);
