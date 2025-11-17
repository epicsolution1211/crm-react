import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";

import { QuickActionWidget } from "src/sections/dashboard/customer/customer-list-table/widget/quick-action";
import { ChatReminderDialog } from "src/sections/dashboard/chat/chat-reminder-dialog";
import { LabelsDialog } from "src/components/labels-dialog";
import { CustomerCreateSms } from "src/sections/dashboard/customer/customer-create-sms";
import { CustomerCreateQuickEmail } from "src/sections/dashboard/customer/customer-create-quick-email";
import { chatApi } from "src/api/chat";
import { useAuth } from "src/hooks/use-auth";
import { defaultQuickIconRule } from "src/components/table-settings-modal";

export const QuickActionDetail = ({ 
  data, 
  fields, 
  emails, 
  phoneNumbers, 
  setUpdateFieldsOpen,
  setAssignFormOpen,
  handleOpenCustomerChat,
  setShowCommentModal,
  handleOpenPhoneCallStarter,
  traderDisabled,
  handleTraderLogin,
  handleDashboardLogin,
}) => {
  const { user } = useAuth();
  const localIconSetting = localStorage.getItem("iconSetting");
  const iconSetting = localIconSetting ? JSON.parse(localIconSetting) : [];
  const [iconRule, setIconRule] = useState({})

  useEffect(() => {
    const columnSetting = user?.column_setting ? JSON.parse(user.column_setting) : null;
    if (columnSetting?.customerQuickAction) {
      setIconRule(columnSetting.customerQuickAction)
    } else {
      setIconRule(defaultQuickIconRule)
    }
  }, [user]);

  const [reminderClientId, setReminderClientId] = useState(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [editLabelModalOpen, setEditLabelModalOpen] = useState(false);

  const [messageId, setMessageId] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [quickEmailInfo, setQuickEmailInfo] = useState({ customerId: undefined, brandId: undefined });
  const [EmailModalOpen, setEmailModalOpen] = useState(false);

  const handleCreateSms = async (sms, source_sms_number) => {
    try {
      const request = {
        conversation_id: messageId,
        description: sms,
        row_text: sms,
        send_sms: true,
      };
      if (source_sms_number) request["source_sms_number"] = source_sms_number;
      // eslint-disable-next-line no-unused-vars
      const { message } = await chatApi.sendMessage(request);
      toast.success("SMS successfully sent!");

      // const clientsWithSms = _tableData?.map((td) => {
      //   if (td?.sms_conversation_id === messageId) {
      //     return {
      //       ...td,
      //       sms_messages: [...td?.sms_messages, message],
      //     };
      //   } else {
      //     return td;
      //   }
      // });

      // setTableData(clientsWithSms);

      setMessageId(null);
      setMessageModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <>
      <Stack>
        <QuickActionWidget
          data={data}
          fields={fields}
          rule={iconRule}
          defaultRule={defaultQuickIconRule}
          emails={emails}
          phoneNumbers={phoneNumbers}
          handleReminder={(id)=> {
            setReminderClientId(id);
            setReminderOpen(true);
          }}
          handleLabelsDialogOpen={()=> setEditLabelModalOpen(true)}
          setCustomerToEditFields={()=> setUpdateFieldsOpen()}
          assignCustomerForms={()=> setAssignFormOpen()}
          handleCustomerCall={()=> handleOpenPhoneCallStarter()}
          handleOpenCustomerChat={handleOpenCustomerChat}
          setCommentClientId={()=> setShowCommentModal(true)}
          setMessageId={(id)=> {
            setMessageId(id);
            setMessageModalOpen(true);
          }}
          setQuickEmailInfo={(id)=> {
            setQuickEmailInfo(id);    
            setEmailModalOpen(true);  
          }}
          iconSetting={iconSetting}
          traderDisabled={traderDisabled}
          handleTraderLogin={handleTraderLogin}
          handleDashboardLogin={handleDashboardLogin}
          isDetail
        />
      </Stack>

      <ChatReminderDialog
        open={reminderOpen}
        onClose={() => {
          setReminderClientId(null);
          setReminderOpen(false);
        }}
        clientId={reminderClientId}
      />
      <LabelsDialog
        title="Edit Label"
        open={editLabelModalOpen ?? false}
        onClose={() => setEditLabelModalOpen(false)}
      />

      {messageId ? (
        <CustomerCreateSms
          open={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setMessageId(null);
          }}
          onSmsCreate={handleCreateSms}
        />
      ) : null}

      <CustomerCreateQuickEmail
        quickEmailInfo={quickEmailInfo}
        open={EmailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setQuickEmailInfo({ customerId: undefined, brandId: undefined });
        }}
      />
    </>
  )
};