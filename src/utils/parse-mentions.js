export const parseMentions = (text) => {
  if (!text) return { text, mentions: [] };
  
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
      username: match[1]
    });
  }
  
  return { text, mentions };
};

export const extractMentionIds = (text, members) => {
  if (!text || !members) return [];
  
  const { mentions } = parseMentions(text);
  const mentionIds = [];
  
  mentions.forEach(mention => {
    const member = members.find(m => 
      m.first_name?.toLowerCase().includes(mention.username.toLowerCase()) ||
      m.last_name?.toLowerCase().includes(mention.username.toLowerCase()) ||
      m.email?.toLowerCase().includes(mention.username.toLowerCase()) ||
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(mention.username.toLowerCase())
    );
    
    if (member) {
      mentionIds.push(member.id);
    }
  });
  
  return [...new Set(mentionIds)];
};

export const replaceMentionsWithNames = (text, members) => {
  if (!text || !members) return text;
  
  const { mentions } = parseMentions(text);
  let result = text;
  
  mentions.forEach(mention => {
    const member = members.find(m => 
      m.first_name?.toLowerCase().includes(mention.username.toLowerCase()) ||
      m.last_name?.toLowerCase().includes(mention.username.toLowerCase()) ||
      m.email?.toLowerCase().includes(mention.username.toLowerCase()) ||
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(mention.username.toLowerCase())
    );
    
    if (member) {
      const displayName = member.first_name ? `${member.first_name} ${member.last_name}` : member.email;
      result = result.replace(mention.text, `@${displayName}`);
    }
  });
  
  return result;
}; 