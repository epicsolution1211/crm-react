import {useCallback, useEffect, useState} from "react";
import {settingsApi} from "../../api/settings";
import toast from "react-hot-toast";

export const useMiniChatAccept = () => {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleTeamGet = async () => {
      const team = await settingsApi.getMiniChatAppearance();
      const teams = await settingsApi.getTeams();
      const { chat_input: chatInput } = await settingsApi.getMiniChatInput();
      setTeam(team?.appearance?.team_id);
      setTeams(teams);
      setEnabled(chatInput);
    }

    handleTeamGet();
  }, []);

  const handleUpdateTeam = useCallback(async (e) => {
    await settingsApi.updateMiniChatDefaultTeam({ team_id: e.target.value });
    setTeam(e.target.value);
    toast("Mini chat team updated!");
  }, []);

  const handleEnabledChange = useCallback(async () => {
    setEnabled(!enabled);
    await settingsApi.updateMiniChatInput({ enabled: !enabled });
    toast("Mini chat input status updated!");
  })

  return { team, teams, setTeam, handleUpdateTeam, enabled, handleEnabledChange };
}