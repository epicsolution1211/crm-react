import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatEmailNotification = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const handleMembersGet = async () => {
      const members = await settingsApi.getMembers();
      setMembers(members?.accounts);
    }

    handleMembersGet();
  }, []);

  const handleUpdateEmailNotification = useCallback(async (data) => {
    await settingsApi.updateMiniChatEmailNotification({
      account_id: data.accountId,
      ticket_email: data.ticket_email,
    });
    const members = await settingsApi.getMembers();
    setMembers(members?.accounts);
    toast("Mini chat email notification is updated!");
  }, []);

  return { members, handleUpdateEmailNotification };
}