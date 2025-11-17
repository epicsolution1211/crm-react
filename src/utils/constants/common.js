// Email settings constants
export const AUTH_TYPE_OPTIONS = [
  { label: 'Plain (Default)', value: 'plain' },
  { label: 'Login (Office 365/Outlook)', value: 'login' },
  { label: 'CRAM-MD5 (More Secure)', value: 'cram_md5' },
];

export const EMAIL_PROVIDERS = {
  gmail: {
    imap_host: 'imap.gmail.com',
    imap_port: 993,
    imap_ssl: true,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_ssl: true,
  },
  outlook: {
    imap_host: 'outlook.office365.com',
    imap_port: 993,
    imap_ssl: true,
    smtp_host: 'smtp.office365.com',
    smtp_port: 587,
    smtp_ssl: true,
  },
  custom: {
    imap_host: '',
    imap_port: '',
    imap_ssl: true,
    smtp_host: '',
    smtp_port: '',
    smtp_ssl: true,
  }
};