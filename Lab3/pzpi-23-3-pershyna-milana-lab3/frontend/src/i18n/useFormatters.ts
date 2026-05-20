import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';

export const useFormatters = () => {
    const { i18n } = useTranslation();
    const locale = i18n.language === 'uk' ? uk : enUS;

    return {
        formatDate: (date: string | Date) => format(new Date(date), 'PP', { locale }),
        formatDateTime: (date: string | Date) => format(new Date(date), 'PPpp', { locale }),
        formatMonthYear: (date: string | Date) => format(new Date(date), 'MMM yyyy', { locale }),
        formatNumber: (n: number) => new Intl.NumberFormat(i18n.language).format(n),
        sortStrings: (a: string, b: string) => a.localeCompare(b, i18n.language),
    };
};
