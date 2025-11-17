import { AttachmentsInfo } from './attachments-info';

export const TaskContentAttachments = ({ todo, mutate }) => {
  return (
    <AttachmentsInfo todo={todo} mutate={mutate} />
  );
};



