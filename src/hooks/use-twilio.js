import { useContext } from 'react';
import { TwilioVoiceContext } from 'src/contexts/twilio-context';

export const useTwilio = () => useContext(TwilioVoiceContext);
