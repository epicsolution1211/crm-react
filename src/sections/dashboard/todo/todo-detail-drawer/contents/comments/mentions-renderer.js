import { useCallback } from 'react';
import Link from '@mui/material/Link';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

export const MentionsRenderer = ({ text, mentionedAccounts = [], ...other }) => {
  const router = useRouter();

  const handleMentionClick = useCallback((accountId, event) => {
    event.preventDefault();
    router.push(paths.dashboard.members.access.replace(':memberId', accountId));
  }, [router]);

  if (!text || !mentionedAccounts || mentionedAccounts.length === 0) {
    return <span {...other}>{text}</span>;
  }

  const renderTextWithMentions = () => {
    let result = text;
    const elements = [];
    let lastIndex = 0;

    mentionedAccounts.forEach((account, index) => {
      const mentionText = `@${account.name}`;
      const mentionIndex = result.indexOf(mentionText, lastIndex);
      
      if (mentionIndex !== -1) {
        if (mentionIndex > lastIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {result.slice(lastIndex, mentionIndex)}
            </span>
          );
        }
        
        elements.push(
          <Link
            key={`mention-${index}`}
            href="#"
            onClick={(e) => handleMentionClick(account.id, e)}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {mentionText}
          </Link>
        );
        
        lastIndex = mentionIndex + mentionText.length;
      }
    });
    
    if (lastIndex < result.length) {
      elements.push(
        <span key="text-end">
          {result.slice(lastIndex)}
        </span>
      );
    }
    
    return elements.length > 0 ? elements : text;
  };

  return (
    <span {...other}>
      {renderTextWithMentions()}
    </span>
  );
};
