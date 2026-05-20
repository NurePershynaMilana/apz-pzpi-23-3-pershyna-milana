import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { setLanguage } from '@/features/settings/settingsSlice';

const LANGUAGES = [
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const LanguageSwitcher = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();

    const handleChange = (code: string) => {
        i18n.changeLanguage(code);
        dispatch(setLanguage(code));
        setAnchor(null);
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
                <LanguageIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                {LANGUAGES.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => handleChange(lang.code)}
                        selected={i18n.language === lang.code}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{lang.flag}</span>
                            <Typography variant="body2">{lang.label}</Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
