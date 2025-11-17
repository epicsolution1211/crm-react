export const roleTemplateDefault = [
  {
    name: "Active",
    info: "Enabling this option will activate the user",
    description: "Determines if the user has an active status and can access the system.",
    edit: {
      param: "acc_e_active",
      value: true,
      description: "User can control account activation status"
    },
  },
  {
    name: "Change Password",
    info: "Enables user to change his password",
    description: "Enables user to change his password",
    edit: {
      param: "acc_e_password",
      value: true,
      description: "User can change his password"
    },
  },
  {
    name: "Delete self account",
    info: "It enables option for user to delete their own account",
    description: "Allow agent to delete his account",
    edit: {
      param: "acc_e_self_delete",
      value: false,
      description: "User can delete their own account"
    }
  },
  {
    name: "Tasks",
    info: `It enables the "Tasks" menu for agents, where agents can see Tasks information"`,
    description: "Allows users to view and access tasks.",
    view: {
      param: "acc_v_tasks",
      value: true,
      description: "User can access tasks information"
    },
  },
  {
    name: "Tickets",
    info: `It enables the "Tickets" menu for agents, where agents can see Tickets information"`,
    description: "Allows users to view and access tickets.",
    view: {
      param: "acc_v_tickets",
      value: true,
      description: "User can access tickets information"
    },
  },
  {
    name: "Leaderboard",
    info: `It enables the "Leaderboard" menu for agents, where agents can see Leaderboard information"`,
    description: "Allows users to view and access leaderboard.",
    view: {
      param: "acc_v_leaderboard",
      value: true,
      description: "User can access leaderboard information"
    },
  },
  {
    name: "Overview",
    info: "Overview menu can be made accessible",
    description: "Allows users to view and access the overview menu and dashboard.",
    view: {
      param: "acc_v_overview",
      value: true,
      description: "User can view the overview menu and dashboard"
    }
  },
  {
    name: "Customers",
    info: "Manage and view customer profiles, track their interactions, and monitor purchase histories.",
    description: "Allows users to manage and view customer profiles, track their interactions, and monitor purchase histories.",
    view: {
      param: "acc_v_client",
      value: true,
      description: "User can access the customers section"
    },
    items: [
      {
        name: "Can view all clients",
        info: "Enables user to see all clients",
        view: {
          param: "acc_v_client_all",
          value: false,
          description: "User can view all clients in the system"
        },
      },
      {
        name: "Can see all clients of assigned desk",
        info: "User can see all clients assigned to the desk user",
        view: {
          param: "acc_v_desk_clients",
          value: true,
          description: "User can view all clients assigned to their desk"
        },
      },
      {
        name: "Can see assigned desks reminders",
        info: "User can see assigned desks reminders",
        view: {
          param: "acc_v_assigned_desk_reminders",
          value: true,
          description: "User can view reminders for their assigned desks"
        },
      },
      {
        name: "Can bulk delete customers",
        info: "Enables user to delete customers in bulk number",
        edit: {
          param: "acc_e_client_bulk_delete",
          value: false,
          description: "User can delete multiple customers at once"
        },
      },
      {
        name: "Can see client logs",
        info: "Enables user to see client/customer logs",
        view: {
          param: "acc_v_client_logs",
          value: false,
          description: "User can view activity logs for clients"
        },
      },
      {
        name: "Can export customers",
        info: "Enables user to export customers selected",
        view: {
          param: "acc_v_customer_download",
          value: true,
          description: "User can export selected customer data"
        },
      },
      {
        name: "Can distribute selected clients equally",
        info: "Enables user to distribute clients equally among the agents",
        edit: {
          param: "acc_e_client_distribute_clients",
          value: true,
          description: "User can distribute clients evenly among agents"
        },
      },
      {
        name: "Can reassign selected clients",
        info: "Enables user to reassign the client to the agents",
        edit: {
          param: "acc_e_client_reassign_clients",
          value: true,
          description: "User can reassign clients to different agents"
        },
      },
      {
        name: "Can assign customer to everyone",
        info: "Enables user to assign the customers to any agents",
        view: {
          param: "acc_v_agent_assign_everyone",
          value: true,
          description: "User can assign customers to any agent in the system"
        },
      },
      {
        name: "Can assign multiple agents to a client",
        info: "Enables user to assign more than one agent to the customers",
        edit: {
          param: "acc_e_assign_multiple_agents",
          value: true,
          description: "User can assign multiple agents to a single client"
        },
      },
      {
        name: "Can shuffle selected clients in distribution",
        info: "Enable user to shuffle clients among the agents",
        edit: {
          param: "acc_e_client_shuffle_selected",
          value: true,
          description: "User can randomly redistribute selected clients among agents"
        }
      },
      {
        name: "Assigned all desks",
        info: "User can assign agents of all desks",
        edit: {
          param: "acc_e_client_desk",
          value: true,
          description: "User can assign clients to agents from any desk"
        },
        view: {
          param: "acc_v_client_desk",
          value: true,
          description: "User can view desk assignments for clients"
        }
      },
      {
        name: "Assigned self desks",
        info: "User can assign agents to customers of his desk",
        edit: {
          param: "acc_e_client_self_desk",
          value: true,
          description: "User can assign clients to agents within their own desk"
        },
        view: {
          param: "acc_v_client_self_desk",
          value: true,
          description: "User can view their own desk assignments"
        }
      },
      {
        name: "Delete desk",
        info: "Enables user to delete any desk",
        edit: {
          param: "acc_e_delete_desk",
          value: true,
          description: "User can delete desks from the system"
        },
      },
      {
        name: "Delete role",
        info: "Enables user to delete any role",
        edit: {
          param: "acc_e_delete_role",
          value: true,
          description: "User can delete roles from the system"
        },
      },
      {
        name: "Delete team",
        info: "Enables user to delete any team",
        edit: {
          param: "acc_e_delete_team",
          value: true,
          description: "User can delete teams from the system"
        },
      },
      {
        name: "Delete agent",
        info: "Enables user to delete any agent",
        edit: {
          param: "acc_e_delete_agent",
          value: true,
          description: "User can delete agents from the system"
        },
      },
      {
        name: "Assignee Agent",
        info: "It allows agents to assign different agents to customers who have assigned themselves",
        edit: {
          param: "acc_e_client_agent",
          value: true,
          description: "User can reassign self-assigned customers to different agents"
        },
        view: {
          param: "acc_v_client_agent",
          value: true,
          description: "User can view agent assignments for customers"
        }
      },
      {
        name: "Assignee Team",
        info: "User can assign agents to customers of his team",
        edit: {
          param: "acc_e_client_team",
          value: true,
          description: "User can assign agents to customers within their team"
        },
        view: {
          param: "acc_v_client_team",
          value: true,
          description: "User can view team assignments for customers"
        },
      },
      {
        name: "Assignee Desks & Agents",
        info: "User can assign agents to customers of all desks",
        edit: {
          param: "acc_e_client_assign_desks_agents",
          value: true,
          description: "User can assign agents to customers of all desks"
        },
      },
      {
        name: "Assignee Multi Desks",
        info: "User can assign agents to customers of multiple desks",
        edit: {
          param: "acc_e_client_assign_multi_desks",
          value: true,
          description: "User can assign agents to customers of multiple desks"
        },
      },
      {
        name: "Full Name",
        info: "Enables user to see or edit client full name",
        edit: {
          param: "acc_e_client_name",
          value: true,
          description: "User can edit the full name of clients"
        },
        view: {
          param: "acc_v_client_name",
          value: true,
          description: "User can view the full name of clients"
        },
      },
      {
        name: "First Name",
        info: "Enables user to see or edit client first name",
        edit: {
          param: "acc_e_client_first_name",
          value: true,
          description: "User can edit the first name of clients"
        },
        view: {
          param: "acc_v_client_first_name",
          value: true,
          description: "User can view the first name of clients"
        },
      },
      {
        name: "Last Name",
        info: "Enable user to see or edit client's last name",
        edit: {
          param: "acc_e_client_last_name",
          value: true,
          description: "User can edit the last name of clients"
        },
        view: {
          param: "acc_v_client_last_name",
          value: true,
          description: "User can view the last name of clients"
        },
      },
      {
        name: "Email",
        info: "User can see or edit client's email",
        edit: {
          param: "acc_e_client_email",
          value: true,
          description: "User can edit client email addresses"
        },
        view: {
          param: "acc_v_client_email",
          value: true,
          description: "User can view client email addresses"
        },
        hide: {
          param: "acc_h_client_email",
          value: false,
          description: "User can hide client email addresses"
        },
      },
      {
        name: "Can add email",
        info: "User can see or edit client's email",
        edit: {
          param: "acc_e_client_email_add",
          value: true,
          description: "User can add new email addresses for clients"
        },
      },
      {
        name: "Phone",
        info: "User can see or edit client's phone",
        edit: {
          param: "acc_e_client_phone",
          value: true,
          description: "User can edit client phone numbers"
        },
        view: {
          param: "acc_v_client_phone",
          value: true,
          description: "User can view client phone numbers"
        },
        hide: {
          param: "acc_h_client_phone",
          value: false,
          description: "User can hide client phone numbers"
        },
      },
      {
        name: "Can add phone",
        info: "User can see or edit client's phone",
        edit: {
          param: "acc_e_client_phone_add",
          value: true,
          description: "User can add new phone numbers for clients"
        },
      },
      {
        name: "Company",
        info: "Enables user to see or edit company feature",
        edit: {
          param: "acc_e_client_company",
          value: true,
          description: "User can edit company information for clients"
        },
        view: {
          param: "acc_v_client_company",
          value: true,
          description: "User can view company information for clients"
        },
      },
      {
        name: "Pin Code",
        info: "Enables user to see or edit pin code",
        edit: {
          param: "acc_e_client_pin",
          value: true,
          description: "User can edit client PIN codes"
        },
        view: {
          param: "acc_v_client_pin",
          value: true,
          description: "User can view client PIN codes"
        },
        hide: {
          param: "acc_h_client_pin",
          value: false,
          description: "User can hide client PIN codes"
        }
      },
      {
        name: "Can send OTP",
        info: "Enable user to see or send OTP",
        view: {
          param: "acc_v_client_otp",
          value: true,
          description: "User can view and send one-time passwords to clients"
        },
      },
      {
        name: "Assign Labels",
        info: "Enables user to assign labels(see or edit)",
        edit: {
          param: "acc_e_client_label",
          value: true,
          description: "User can create and edit labels for clients"
        },
        view: {
          param: "acc_v_client_label",
          value: true,
          description: "User can view labels assigned to clients"
        },
      },
      {
        name: "Internal Brand",
        info: "Enables user to access or see internal brand",
        edit: {
          param: "acc_e_client_internal_brand",
          value: false,
          description: "User can edit internal brand settings"
        },
        view: {
          param: "acc_v_client_internal_brand",
          value: true,
          description: "User can view internal brand information"
        },
      },
      {
        name: "Label Management",
        info: "Enables user to edit label management feature",
        edit: {
          param: "acc_e_client_label_manage",
          value: true,
          description: "User can manage and organize client labels"
        },
      },
      {
        name: "Can create client",
        info: "Enables user to create a new client",
        edit: {
          param: "acc_e_client_add",
          value: true,
          description: "User can create new client accounts"
        },
      },
      {
        name: "Can delete client",
        info: "Enables user to delete a new client",
        edit: {
          param: "acc_e_client_delete",
          value: true,
          description: "User can delete client accounts"
        },
      },
      {
        name: "Analytics",
        info: "Enables user to see or edit analytics",
        view: {
          param: "acc_v_client_analytics",
          value: true,
          description: "User can view analytics on client profiles"
        },
      },
      {
        name: "Note",
        info: "Enables user to see or edit note",
        edit: {
          param: "acc_e_client_note",
          value: true,
          description: "User can edit notes on client profiles"
        },
        view: {
          param: "acc_v_client_note",
          value: true,
          description: "User can view notes on client profiles"
        },
      },
      {
        name: "Self Comment",
        info: "Enables user to see or edit self comments",
        edit: {
          param: "acc_e_client_comment_s",
          value: true,
          description: "User can edit their own comments on client profiles"
        },
        view: {
          param: "acc_v_client_comment_s",
          value: true,
          description: "User can view their own comments on client profiles"
        },
      },
      {
        name: "Others Comment",
        info: "Enables user to see or edit other comments",
        edit: {
          param: "acc_e_client_comment_o",
          value: true,
          description: "User can edit comments made by other users"
        },
        view: {
          param: "acc_v_client_comment_o",
          value: true,
          description: "User can view comments made by other users"
        },
      },
      {
        name: "ICO",
        info: "",
        edit: {
          param: "acc_e_client_ico",
          value: true,
          description: "User can edit ICO-related client information"
        },
        view: {
          param: "acc_v_client_ico",
          value: true,
          description: "User can view ICO-related client information"
        },
      },
      {
        name: "Saving accounts",
        info: "Enables user to see or edit saving accounts",
        edit: {
          param: "acc_e_client_saving",
          value: true,
          description: "User can edit client savings account information"
        },
        view: {
          param: "acc_v_client_saving",
          value: true,
          description: "User can view client savings account information"
        },
      },
      {
        name: "Forms",
        info: "Enables user to see forms",
        edit: {
          param: "acc_e_client_forms",
          value: true,
          description: "User can edit client forms and form submissions"
        },
        view: {
          param: "acc_v_client_forms",
          value: true,
          description: "User can view client forms and form submissions"
        },
      },
      {
        name: "Positions",
        info: "Enables user to see or edit positions",
        edit: {
          param: "acc_e_client_position",
          value: true,
          description: "User can edit client trading positions"
        },
        view: {
          param: "acc_v_client_position",
          value: true,
          description: "User can view client trading positions"
        },
      },
      {
        name: "Create position",
        info: "Enables user to create positions",
        edit: {
          param: "acc_e_client_create_position",
          value: false,
          description: "User can create new trading positions for clients"
        },
      },
      {
        name: "Transaction",
        info: "Enables user to see or edit transactions",
        edit: {
          param: "acc_e_transaction",
          value: true,
          description: "User can edit client transactions"
        },
        view: {
          param: "acc_v_transaction",
          value: true,
          description: "User can view client transactions"
        },
      },
      {
        name: "Delete Transaction",
        info: "Enables user to delete transaction",
        edit: {
          param: "acc_e_delete_transaction",
          value: true,
          description: "User can delete client transactions"
        },
      },
      {
        name: "Transaction Label",
        info: "Enables user to see or edit transaction label",
        edit: {
          param: "acc_e_transaction_label",
          value: true,
          description: "User can edit labels for transactions"
        },
        view: {
          param: "acc_v_transaction_label",
          value: true,
          description: "User can view labels for transactions"
        },
      },
      {
        name: "Transaction Owner Agent",
        info: "Enables user to edit transaction owner agent",
        edit: {
          param: "acc_e_transaction_owner_agent",
          value: true,
          description: "User can modify transaction owner agent"
        },
      },
      {
        name: "Transaction Created At Update",
        info: "Enables user to edit transaction created at",
        edit: {
          param: "acc_e_transaction_created_at",
          value: true,
          description: "User can modify transaction creation timestamps"
        },
      },
      {
        name: "Transaction Approved At Update",
        info: "Enables user to edit transaction approved at",
        edit: {
          param: "acc_e_transaction_approved_at",
          value: true,
          description: "User can modify transaction approval timestamps"
        },
      },
      {
        name: "Transaction Label Management",
        info: "Enables user to edit transaction label",
        edit: {
          param: "acc_e_transaction_label_management",
          value: true,
          description: "User can manage and organize transaction labels"
        },
      },
      {
        name: "Can Add Deposit Transaction",
        info: `Enables user to edit "add transaction deposit"`,
        edit: {
          param: "acc_e_transaction_deposit",
          value: true,
          description: "User can add deposit transactions"
        },
      },
      {
        name: "Can Add Withdrawal Transaction",
        info: `Enables user to edit "add transaction withdrawal"`,
        edit: {
          param: "acc_e_transaction_withdrawal",
          value: true,
          description: "User can add withdrawal transactions"
        },
      },
      {
        name: "Can Add Bonus Transaction",
        info: `Enables user to edit "Can Add Bonus Transaction"`,
        edit: {
          param: "acc_e_transaction_bonus",
          value: true,
          description: "User can add bonus transactions"
        },
      },
      {
        name: "Can Add Credit In Transaction",
        info: `Enables user to edit "Can Add Credit In Transaction"`,
        edit: {
          param: "acc_e_transaction_credit_in",
          value: true,
          description: "User can add credit-in transactions"
        },
      },
      {
        name: "Can Add Credit Out Transaction",
        info: `Enables user to edit "Can Add Credit Out Transaction"`,
        edit: {
          param: "acc_e_transaction_credit_out",
          value: true,
          description: "User can add credit-out transactions"
        },
      },
      {
        name: "Can Refresh Wallets",
        info: `Enables user to refresh wallets`,
        edit: {
          param: "acc_v_client_refresh_wallets",
          value: true,
          description: "User can refresh client wallets",
        },
      },
      {
        name: "Default Account Type",
        info: `Enables user to edit or see "default account type"`,
        edit: {
          param: "acc_e_client_account_type",
          value: true,
          description: "User can edit default account types for clients"
        },
        view: {
          param: "acc_v_client_account_type",
          value: true,
          description: "User can view default account types for clients"
        },
      },
      {
        name: "Create trader account",
        info: "Enables user to create trader account",
        edit: {
          param: "acc_v_trader_account_create",
          value: true,
          description: "User can create new trader accounts"
        },
      },
      {
        name: "Password",
        info: `Enables user to see or edit "password"`,
        edit: {
          param: "acc_e_client_password",
          value: true,
          description: "User can edit client passwords"
        },
        view: {
          param: "acc_v_client_password",
          value: true,
          description: "User can view client passwords"
        },
      },
      {
        name: "Currency",
        info: `Enables user to see or edit "currency"`,
        edit: {
          param: "acc_e_client_currency",
          value: true,
          description: "User can edit client account currencies"
        },
        view: {
          param: "acc_v_client_currency",
          value: true,
          description: "User can view client account currencies"
        },
      },
      {
        name: "Show login to trader",
        info: `Enables user to see "trader login"`,
        edit: {
          param: "acc_v_client_login_trader",
          value: true,
          description: "User can view trader login information"
        },
      },
      {
        name: "Show login to dashboard",
        info: `Enables user to see login link of dashboard (client's dashboard)`,
        edit: {
          param: "acc_v_client_login_dashboard",
          value: true,
          description: "User can view client dashboard login information"
        },
      },
      {
        name: "Trade Active",
        info: `It enables the customer to activate trading options`,
        edit: {
          param: "acc_e_client_freez",
          value: true,
          description: "User can activate or deactivate client trading"
        },
      },
      {
        name: "Trade Lock",
        info: `It enables to lock the trade for the customers`,
        edit: {
          param: "acc_e_client_trade_lock",
          value: true,
          description: "User can lock or unlock client trading"
        },
      },
      {
        name: "Transfer Lock",
        info: `It enables to lock the transfer for the customers`,
        edit: {
          param: "acc_e_client_transfer_lock",
          value: true,
          description: "User can lock or unlock client transfer"
        },
      },
      {
        name: "Withdraw Lock",
        info: `It enables to lock the withdraw for the customers`,
        edit: {
          param: "acc_e_client_withdraw_lock",
          value: true,
          description: "User can lock or unlock client withdraw"
        },
      },
      {
        name: "Trader Link",
        info: `It enables to view the copy trader link button inside customer trader settings`,
        view: {
          param: "acc_v_client_trader_link",
          value: true,
          description: "User can view copy trader link for clients"
        },
      },
      {
        name: "Wallets",
        info: `It enables wallet menu for the agent`,
        edit: {
          param: "acc_e_client_walletl",
          value: true,
          description: "User can edit client wallet information"
        },
        view: {
          param: "acc_v_client_wallet",
          value: true,
          description: "User can view client wallet information"
        },
      },
      {
        name: "Show active wallets",
        info: `It enables the agent to see active wallets`,
        view: {
          param: "acc_v_active_wallets",
          value: true,
          description: "User can view active client wallets"
        },
      },
      {
        name: "Show inactive wallets",
        info: `It enables the agent to see inactive wallets`,
        view: {
          param: "acc_v_inactive_wallets",
          value: true,
          description: "User can view inactive client wallets"
        },
      },
      {
        name: "Trader Settings",
        info: `It enables the customer to see trader settings`,
        view: {
          param: "acc_v_client_trader_settings",
          value: true,
          description: "User can view trader settings for clients"
        },
      },
      {
        name: "Posts",
        info: `Write a post for clients in client dashboard`,
        view: {
          param: "acc_v_client_posts",
          value: true,
          description: "User can view and create posts for client dashboard"
        },
      },
      {
        name: "Lead source",
        info: `Its enable Lead Source on client details page`,
        view: {
          param: "acc_v_client_lead_source",
          value: true,
          description: "User can view lead source information for clients"
        },
      },
      {
        name: "KYC",
        info: `Its enable KYC option for client`,
        view: {
          param: "acc_v_client_kyc",
          value: true,
          description: "User can view KYC information for clients"
        },
      },
      {
        name: "Calls",
        info: `Its enable calls option for client`,
        view: {
          param: "acc_v_customer_calls",
          value: true,
          description: "User can view calls for clients"
        },
      },
      {
        name: "Bets",
        info: `Its enable bets option for client`,
        view: {
          param: "acc_v_client_bets",
          value: true,
          description: "User can view bets for clients"
        },
      },
      {
        name: "PSP Links",
        info: `Its enable PSP Links option for client`,
        view: {
          param: "acc_v_client_psp_links",
          value: false,
          description: "User can view PSP Links for clients"
        },
      },
      {
        name: "Upload KYC on behalf of client",
        info: `Its enable KYC uploading on behalf of client`,
        view: {
          param: "acc_v_client_kyc_upload",
          value: true,
          description: "User can upload KYC documents on behalf of clients"
        },
      },
      {
        name: "Approve or reject client KYC",
        info: `Its enable approval or reject client's KYC`,
        view: {
          param: "acc_v_client_kyc_approve",
          value: true,
          description: "User can approve or reject client KYC documents"
        },
      },
      {
        name: "View client KYC documents",
        info: `Its enable view client's KYC documents`,
        view: {
          param: "acc_v_client_kyc_view",
          value: true,
          description: "User can view client KYC documents"
        },
      },
      {
        name: "Manual ID Verification",
        info: `Its enable manual ID verification`,
        edit: {
          param: "acc_e_kyc_manual_id",
          value: true,
          description: "Agent can manually verify client ID"
        },
      },
      {
        name: "Manual Billing Address Verification",
        info: `Its enable manual billing address verification`,
        edit: {
          param: "acc_e_kyc_manual_billing",
          value: true,
          description: "Agent can manually verify client billing address"
        },
      },
      {
        name: "Deposit count",
        info: `Its enables agents to see deposit count`,
        view: {
          param: "acc_v_client_deposit_count",
          value: true,
          description: "User can view client's deposit count"
        },
      },
      {
        name: "View first deposit",
        info: `Its enables agents to see 1st deposit in transactions`,
        view: {
          param: "acc_v_client_first_deposit",
          value: false,
          description: "User can view client's first deposit information"
        },
      },
      {
        name: "View second deposit",
        info: `Its enables agents to see 2nd deposit in transactions`,
        view: {
          param: "acc_v_client_second_deposit",
          value: false,
          description: "User can view client's second deposit information"
        },
      },
      {
        name: "View third deposit",
        info: `Its enables agents to see 3rd deposit in transactions`,
        view: {
          param: "acc_v_client_third_deposit",
          value: false,
          description: "User can view client's third deposit information"
        },
      },
      {
        name: "View last deposit",
        info: `Its enables agents to see last deposit in transactions`,
        view: {
          param: "acc_v_client_last_deposit",
          value: false,
          description: "User can view client's most recent deposit information"
        },
      },
      {
        name: "View total deposit",
        info: `Its enables agents to see total deposit in transactions`,
        view: {
          param: "acc_v_client_total_deposit",
          value: false,
          description: "User can view client's total deposit amount"
        },
      },
      {
        name: "View average deposit",
        info: `Its enables agents to see average deposit in transactions`,
        view: {
          param: "acc_v_client_avg_deposit",
          value: true,
          description: "User can view client's average deposit amount"
        },
      },
      {
        name: "View net deposit",
        info: `Its enables agents to see net deposit in transactions`,
        view: {
          param: "acc_v_client_net_deposit",
          value: true,
          description: "User can view client's net deposit amount"
        },
      },
      {
        name: "View net financial",
        info: `Its enables agents to see net financial in transactions`,
        view: {
          param: "acc_v_client_net_financial",
          value: true,
          description: "User can view client's net financial amount"
        },
      },
      {
        name: "View total withdrawal",
        info: `Its enables agents to see total withdrawal in transactions`,
        view: {
          param: "acc_v_client_total_withdrawal",
          value: true,
          description: "User can view client's total withdrawal amount"
        },
      },
      {
        name: "View last withdrawal",
        info: `Its enables agents to see last withdrawal in transactions`,
        view: {
          param: "acc_v_client_last_withdrawal",
          value: true,
          description: "User can view client's last withdrawal amount"
        },
      },
      {
        name: "View last withdrawal date",
        info: `Its enables agents to see last withdrawal date in transactions`,
        view: {
          param: "acc_v_client_last_withdrawal_date",
          value: true,
          description: "User can view client's last withdrawal date"
        },
      },
      {
        name: "View withdrawal count",
        info: `Its enables agents to see withdrawal count in transactions`,
        view: {
          param: "acc_v_client_withdrawal_count",
          value: true,
          description: "User can view client's withdrawal count"
        },
      },
      {
        name: "View total bet amount",
        info: `Its enables agents to see total bet amount in transactions`,
        view: {
          param: "acc_v_client_total_bet_amount",
          value: true,
          description: "User can view client's total bet amount"
        },
      },
      {
        name: "View total win amount",
        info: `Its enables agents to see total win amount in transactions`,
        view: {
          param: "acc_v_client_total_win_amount",
          value: true,
          description: "User can view client's total win amount"
        },
      },
      {
        name: "View win rate",
        info: `Its enables agents to see win rate in transactions`,
        view: {
          param: "acc_v_client_win_rate",
          value: true,
          description: "User can view client's win rate"
        },
      },
      {
        name: "View average bet amount",
        info: `Its enables agents to see average bet amount in transactions`,
        view: {
          param: "acc_v_client_avg_bet_amount",
          value: true,
          description: "User can view client's average bet amount"
        },
      },
      {
        name: "View bet count",
        info: `Its enables agents to see bet count in transactions`,
        view: {
          param: "acc_v_client_bet_count",
          value: true,
          description: "User can view client's bet count"
        },
      },
      {
        name: "View GGR",
        info: `Its enables agents to see GGR in transactions`,
        view: {
          param: "acc_v_client_ggr",
          value: true,
          description: "User can view client's GGR"
        },
      },
      {
        name: "View first desk name",
        view: {
          param: "acc_v_client_first_desk_name",
          value: false,
          description: "User can view client's first assigned desk name"
        },
      },
      {
        name: "View second desk name",
        view: {
          param: "acc_v_client_second_desk_name",
          value: false,
          description: "User can view client's second assigned desk name"
        },
      },
      {
        name: "View third desk name",
        view: {
          param: "acc_v_client_third_desk_name",
          value: false,
          description: "User can view client's third assigned desk name"
        },
      },
      {
        name: "View first assigned agent",
        view: {
          param: "acc_v_client_first_assigned_agent",
          value: false,
          description: "User can view client's first assigned agent"
        },
      },
      {
        name: "View second assigned agent",
        view: {
          param: "acc_v_client_second_assigned_agent",
          value: false,
          description: "User can view client's second assigned agent"
        },
      },
      {
        name: "View third assigned agent",
        view: {
          param: "acc_v_client_third_assigned_agent",
          value: false,
          description: "User can view client's third assigned agent"
        },
      },
      {
        name: "View last assigned agent",
        view: {
          param: "acc_v_client_last_assigned_agent",
          value: false,
          description: "User can view client's most recently assigned agent"
        },
      },
      {
        name: "View first call",
        view: {
          param: "acc_v_client_first_call",
          value: false,
          description: "User can view client's first call information"
        },
      },
      {
        name: "View second call",
        view: {
          param: "acc_v_client_second_call",
          value: false,
          description: "User can view client's second call information"
        },
      },
      {
        name: "Total Called",
        info: `Its enables agents to see Total Called`,
        view: {
          param: "acc_v_total_called",
          value: true,
          description: "User can view total number of calls made to client"
        },
      },
      {
        name: "View third call",
        view: {
          param: "acc_v_client_third_call",
          value: false,
          description: "User can view client's third call information"
        },
      },
      {
        name: "View FRD Owner",
        view: {
          param: "acc_v_client_frd_owner",
          value: false,
          description: "User can view client's FRD owner information"
        },
      },
      {
        name: "View Last Login",
        info: `Its enables agents to see View Last Login`,
        view: {
          param: "acc_v_last_login",
          value: true,
          description: "User can view client's last login timestamp"
        },
      },
      {
        name: "View Last Comment",
        info: `Its enables agents to see View Last Comment`,
        view: {
          param: "acc_v_last_comment",
          value: true,
          description: "User can view client's last comment"
        },
      },
      {
        name: "View Last Trade At",
        info: `Its enables agents to see View Last Trade At`,
        view: {
          param: "acc_v_last_trade_at ",
          value: true,
          description: "User can view client's last trade timestamp"
        },
      },
      {
        name: "Open PNL",
        info: `Its enables agents to see Open PNL`,
        view: {
          param: "acc_v_open_pnl ",
          value: true,
          description: "User can view client's open profit and loss"
        },
      },
      {
        name: "Close PNL",
        info: `Its enables agents to see Close PNL`,
        view: {
          param: "acc_v_close_pnl",
          value: true,
          description: "User can view client's closed profit and loss"
        },
      },
      {
        name: "Total Brand Status",
        info: `Its enabled agents to see Total Brand Status`,
        view: {
          param: "acc_v_total_brand_status",
          value: true,
          description: "User can view client's total brand status information"
        },
      },
      {
        name: "Reaction Time",
        info: `Its enabled agents to see Reaction Time`,
        view: {
          param: "acc_v_reaction_time",
          value: true,
          description: "User can view client interaction response times"
        },
      },
      {
        name: "Last Status Changed At",
        info: `Its enabled agents to see Last Status Changed At`,
        view: {
          param: "acc_v_last_status_changed_at",
          value: true,
          description: "User can view when client's status was last updated"
        },
      },
      {
        name: "First Status Changed At",
        info: `Its enabled agents to see First Status Changed At`,
        view: {
          param: "acc_v_first_status_changed_at",
          value: true,
          description: "User can view when client's status was first changed"
        },
      },
      {
        name: "Announcements",
        info: `Its enables agent to see Announcements`,
        view: {
          param: "acc_v_client_announcement",
          value: true,
          description: "User can view announcements for clients"
        },
      },
      {
        name: "Trader Account Passwords",
        info: `Its enables agent to see and edit trader account passwords`,
        edit: {
          param: "acc_e_mt_passwords",
          value: true,
          description: "User can view and edit trader account passwords"
        },
        view: {
          param: "acc_v_mt_passwords",
          value: true,
          description: "User can view trader account passwords"
        },
      },
      {
        name: "Client Security Report",
        info: `Its enables agent to see Client Security Report`,
        view: {
          param: "acc_v_client_security_report",
          value: true,
          description: "Agent can view security report for client"
        },
      },
      {
        name: "Can edit custom fields",
        info: `Its enables agent to edit custom field`,
        edit: {
          param: "acc_e_client_data",
          value: true,
          description: "User can edit custom fields in client profiles"
        },
        key: 'custom_filed_edit',
      },
      {
        name: "Can bulk edit custom fields",
        info: `Its enables agent to edit bulk custom field`,
        edit: {
          param: "acc_e_client_bulk_data",
          value: true,
          description: "User can edit custom fields for multiple clients at once"
        },
        key: 'custom_filed_bulk_edit',
      },
    ]
  },
  {
    name: "IB Room",
    info: "IB Room menu can be made accessible",
    description: "Allows users to access the IB (Introducing Broker) room",
    view: {
      param: "acc_v_ib_room",
      value: false,
      description: "User can access the IB (Introducing Broker) room"
    },
    items: [
      {
        name: "IB List",
        info: `Enables the agent to see IB list`,
        view: {
          param: "acc_v_ib_list",
          value: true,
          description: "User can view the list of introducing brokers"
        },
      },
      {
        name: "IB Requests",
        info: `Enables the agent to see IB Requests`,
        view: {
          param: "acc_v_ib_requests",
          value: true,
          description: "User can view requests from introducing brokers"
        },
      },
      {
        name: "IB Rewards",
        info: `Enables the agent to see IB Rewards`,
        view: {
          param: "acc_v_ib_rewards",
          value: true,
          description: "User can view rewards from introducing brokers"
        },
      },
    ]
  },
  {
    name: "Agents",
    info: "Agents menu can be made accessible",
    description: "Oversee and manage agent profiles, track performance metrics, and allocate tasks.",
    view: {
      param: "acc_v_agents",
      value: true,
      description: "User can access agent management features"
    },
    items: [
      {
        name: "Self",
        view: {
          param: "acc_v_agent_self",
          value: true,
          description: "User can view their own agent profile"
        },
      },
      {
        name: "Desk",
        view: {
          param: "acc_v_desk",
          value: true,
          description: "User can view desk information"
        },
      },
      {
        name: "All",
        view: {
          param: "acc_v_agent_all",
          value: true,
          description: "User can view all agent profiles"
        },
      },
    ]
  },
  {
    name: "Chat",
    info: "Chat menu can be made accessible",
    description: "Facilitates real-time communication between team members, enhancing collaboration.",
    view: {
      param: "acc_v_chat",
      value: true,
      description: "User can access chat features"
    },
    items: [
      {
        name: "Chat room creating",
        info: `It enables agents to create a custom chat`,
        edit: {
          param: "acc_e_chat_create",
          value: true,
          description: "User can create new chat rooms"
        },
      },
      {
        name: "Add members and teams to chat",
        info: `It enables agents to add members and Team in the chat`,
        edit: {
          param: "acc_e_chat_add",
          value: true,
          description: "User can add members and teams to chat rooms"
        },
      },
      {
        name: "Edit Self message",
        info: `It enables the agent to edit his/her messages in a chat`,
        edit: {
          param: "acc_e_chat_self_message",
          value: true,
          description: "User can edit their own messages in chat"
        },
      },
      {
        name: "Edit others message",
        info: `It enables the access to edit others messages`,
        edit: {
          param: "acc_e_chat_others_message",
          value: true,
          description: "User can edit messages from other users in chat"
        },
      },
    ]
  },
  {
    name: "Support Chats",
    info: "Support Chats can be made accessible",
    description: "Support Chats",
    view: {
      param: "acc_v_support_chats",
      value: true,
      description: "User can access support chat features"
    },
  },
  {
    name: "Emails",
    info: "Emails can be made accessible",
    description: "Emails",
    view: {
      param: "acc_v_emails",
      value: true,
      description: "User can access email communications"
    },
  },
  {
    name: "Lead management",
    info: "Lead management can be made accessible",
    description: "Monitor and manage potential customers, track interactions, and streamline the conversion process.",
    view: {
      param: "acc_v_lead_management",
      value: true,
      description: "User can access lead management features"
    },
    items: [
      {
        name: "Leads",
        info: `Enables the agent to see all leads`,
        edit: {
          param: "acc_e_lm_leads",
          value: true,
          description: "User can edit lead information"
        },
        view: {
          param: "acc_v_lm_leads",
          value: true,
          description: "User can view all leads"
        },
      },
      {
        name: "Can see leads from all desks",
        info: "Enables the user to see leads from all desks",
        view: {
          param: "acc_v_all_leads_desk",
          value: true,
          description: "User can view leads from all desks"
        },
      },
      {
        name: "Can export leads",
        info: `Enables the user to export the selected leads`,
        edit: {
          param: "acc_e_lm_export_leads",
          value: true,
          description: "User can export selected leads"
        },
      },
      {
        name: "Can delete leads",
        info: `Enables the user to delete the selected leads`,
        edit: {
          param: "acc_e_lm_delete_leads",
          value: true,
          description: "User can delete selected leads"
        },
      },
      {
        name: "Affiliates",
        info: `Enables user to access the "Affiliates" under Lead management menu`,
        edit: {
          param: "acc_e_lm_aff",
          value: true,
          description: "User can edit affiliate information"
        },
        view: {
          param: "acc_v_lm_aff",
          value: true,
          description: "User can view affiliate information"
        },
      },
      {
        name: "Brands",
        info: `Enables user to access the "Brands" under Lead management`,
        edit: {
          param: "acc_e_lm_brand",
          value: true,
          description: "User can edit brand information"
        },
        view: {
          param: "acc_v_lm_brand",
          value: true,
          description: "User can view brand information"
        },
      },
      {
        name: "List Injection",
        info: `Enables user to access the "List Injection" under Lead management menu`,
        edit: {
          param: "acc_e_lm_list",
          value: true,
          description: "User can edit list injection settings"
        },
        view: {
          param: "acc_v_lm_list",
          value: true,
          description: "User can view list injection settings"
        },
      },
      {
        name: "Offers",
        info: `Enables user to access the "Offer" under Lead management menu`,
        edit: {
          param: "acc_e_lm_offer",
          value: true,
          description: "User can edit lead management offers"
        },
        view: {
          param: "acc_v_lm_offer",
          value: true,
          description: "User can view lead management offers"
        },
      },
    ]
  },
  {
    name: "Risk Management",
    info: `It enables the "Risk Management" menu for users`,
    description: "Analyze potential risks in operations and transactions, and implement preventive measures.",
    view: {
      param: "acc_v_risk_management",
      value: true,
      description: "User can access risk management features"
    },
    items: [
      {
        name: "Positions",
        info: `Enables the user to access "Position" section under "Risk Management" menu, where users can see customer's trading position`,
        edit: {
          param: "acc_e_risk_position",
          value: true,
          description: "User can edit trading positions"
        },
        view: {
          param: "acc_v_risk_position",
          value: true,
          description: "User can view trading positions"
        },
      },
      {
        name: "Transactions",
        info: `Enables the user to access "Transaction" section under "Risk Management" menu`,
        view: {
          param: "acc_v_risk_transactions",
          value: true,
          description: "User can view risk management transactions"
        },
      },
      {
        name: "Wallet Transactions",
        info: `It enables the "Wallet Transactions" sub-menu under "Risk Management" menu for agents`,
        view: {
          param: "acc_v_risk_wallet_transactions",
          value: false,
          description: "User can view wallet transactions in risk management"
        },
      },
      {
        name: "Labels",
        info: `It enables agents to view/add labels in a transaction`,
        edit: {
          param: "acc_e_risk_label",
          value: true,
          description: "User can edit transaction labels"
        },
        view: {
          param: "acc_v_risk_label",
          value: true,
          description: "User can view transaction labels"
        },
      },
      {
        name: "Export transactions",
        info: `It enables user to export the selected transactions in excel`,
        view: {
          param: "acc_v_export_transactions",
          value: true,
          description: "User can export selected transactions"
        },
      },
      {
        name: "Export positions",
        info: `It enables user to export the selected positions in excel`,
        view: {
          param: "acc_v_export_positions",
          value: true,
          description: "User can export selected positions"
        },
      },
      {
        name: "External Transaction ID",
        info: `Enables user to view external transaction ID`,
        edit: {
          param: "acc_e_external_transaction_id",
          value: false,
          description: "User can edit external transaction ID"
        },
        view: {
          param: "acc_v_external_transaction_id",
          value: true,
          description: "User can view external transaction ID"
        },
      },
      {
        name: "External Brand",
        info: `Enables user to view external brand`,
        edit: {
          param: "acc_e_external_brand",
          value: false,
          description: "User can edit external brand"
        },
        view: {
          param: "acc_v_external_brand",
          value: true,
          description: "User can view external brand"
        },
      },
      {
        name: "External User ID",
        info: `Enables user to view external user ID`,
        edit: {
          param: "acc_e_external_user_id",
          value: false,
          description: "User can edit external user ID"
        },
        view: {
          param: "acc_v_external_user_id",
          value: true,
          description: "User can view external user ID"
        },
      },
      {
        name: "Payment Method",
        info: `Enables user to view payment method`,
        edit: {
          param: "acc_e_payment_method",
          value: false,
          description: "User can edit payment method"
        },
        view: {
          param: "acc_v_payment_method",
          value: true,
          description: "User can view payment method"
        },
      },
      {
        name: "Payment Method Code",
        info: `Enables user to view payment method code`,
        edit: {
          param: "acc_e_payment_method_code",
          value: false,
          description: "User can edit payment method code"
        },
        view: {
          param: "acc_v_payment_method_code",
          value: true,
          description: "User can view payment method code"
        },
      },
      {
        name: "Processing Status",
        info: `Enables user to view processing status`,
        edit: {
          param: "acc_e_processing_status",
          value: false,
          description: "User can edit processing status"
        },
        view: {
          param: "acc_v_processing_status",
          value: true,
          description: "User can view processing status"
        },
      },
      {
        name: "Failure Reason",
        info: `Enables user to view failure reason`,
        edit: {
          param: "acc_e_failure_reason",
          value: false,
          description: "User can edit failure reason"
        },
        view: {
          param: "acc_v_failure_reason",
          value: true,
          description: "User can view failure reason"
        },
      },
      {
        name: "Real Balance Before",
        info: `Enables user to view real balance before`,
        edit: {
          param: "acc_e_real_balance_before",
          value: false,
          description: "User can edit real balance before"
        },
        view: {
          param: "acc_v_real_balance_before",
          value: true,
          description: "User can view real balance before"
        },
      },
      {
        name: "Real Balance After",
        info: `Enables user to view real balance after`,
        edit: {
          param: "acc_e_real_balance_after",
          value: false,
          description: "User can edit real balance after"
        },
        view: {
          param: "acc_v_real_balance_after",
          value: true,
          description: "User can view real balance after"
        },
      },
      {
        name: "Bonus Balance Before",
        info: `Enables user to view bonus balance before`,
        edit: {
          param: "acc_e_bonus_balance_before",
          value: false,
          description: "User can edit bonus balance before"
        },
        view: {
          param: "acc_v_bonus_balance_before",
          value: true,
          description: "User can view bonus balance before"
        },
      },
      {
        name: "Bonus Balance After",
        info: `Enables user to view bonus balance after`,
        edit: {
          param: "acc_e_bonus_balance_after",
          value: false,
          description: "User can edit bonus balance after"
        },
        view: {
          param: "acc_v_bonus_balance_after",
          value: true,
          description: "User can view bonus balance after"
        },
      },
      {
        name: "Bonus Code",
        info: `Enables user to view bonus code`,
        edit: {
          param: "acc_e_bonus_code",
          value: false,
          description: "User can edit bonus code"
        },
        view: {
          param: "acc_v_bonus_code",
          value: true,
          description: "User can view bonus code"
        },
      },
      {
        name: "Bonus Type",
        info: `Enables user to view bonus type`,
        edit: {
          param: "acc_e_bonus_type",
          value: false,
          description: "User can edit bonus type"
        },
        view: {
          param: "acc_v_bonus_type",
          value: true,
          description: "User can view bonus type"
        },
      },
      {
        name: "Bonus Release Amount",
        info: `Enables user to view bonus release amount`,
        edit: {
          param: "acc_e_bonus_release_amount",
          value: false,
          description: "User can edit bonus release amount"
        },
        view: {
          param: "acc_v_bonus_release_amount",
          value: true,
          description: "User can view bonus release amount"
        },
      },
      {
        name: "Bonus Cancel Reason",
        info: `Enables user to view bonus cancel reason`,
        edit: {
          param: "acc_e_bonus_cancel_reason",
          value: false,
          description: "User can edit bonus cancel reason"
        },
        view: {
          param: "acc_v_bonus_cancel_reason",
          value: true,
          description: "User can view bonus cancel reason"
        },
      },
      {
        name: "Total Pending Withdrawals Count",
        info: `Enables user to view total pending withdrawals count`,
        edit: {
          param: "acc_e_total_pending_withdrawals_count",
          value: false,
          description: "User can edit total pending withdrawals count"
        },
        view: {
          param: "acc_v_total_pending_withdrawals_count",
          value: true,
          description: "User can view total pending withdrawals count"
        },
      },
      {
        name: "Total Pending Withdrawals Amount",
        info: `Enables user to view total pending withdrawals amount`,
        edit: {
          param: "acc_e_total_pending_withdrawals_amount",
          value: false,
          description: "User can edit total pending withdrawals amount"
        },
        view: {
          param: "acc_v_total_pending_withdrawals_amount",
          value: true,
          description: "User can view total pending withdrawals amount"
        },
      },
      {
        name: "User Net Deposits",
        info: `Enables user to view user net deposits`,
        edit: {
          param: "acc_e_user_net_deposits",
          value: false,
          description: "User can edit user net deposits"
        },
        view: {
          param: "acc_v_user_net_deposits",
          value: true,
          description: "User can view user net deposits"
        },
      },
      {
        name: "Is First Deposit",
        info: `Enables user to view is first deposit`,
        edit: {
          param: "acc_e_is_first_deposit",
          value: false,
          description: "User can edit is first deposit"
        },
        view: {
          param: "acc_v_is_first_deposit",
          value: true,
          description: "User can view is first deposit"
        },
      },
      {
        name: "Webhook Data",
        info: `Enables user to view webhook data`,
        edit: {
          param: "acc_e_webhook_data",
          value: false,
          description: "User can edit webhook data"
        },
        view: {
          param: "acc_v_webhook_data",
          value: true,
          description: "User can view webhook data"
        },
      },
      {
        name: "Event Date",
        info: `Enables user to view event date`,
        edit: {
          param: "acc_e_event_date",
          value: false,
          description: "User can edit event date"
        },
        view: {
          param: "acc_v_event_date",
          value: true,
          description: "User can view event date"
        },
      },
      {
        name: "Source System",
        info: `Enables user to view source system`,
        edit: {
          param: "acc_e_source_system",
          value: false,
          description: "User can edit source system"
        },
        view: {
          param: "acc_v_source_system",
          value: true,
          description: "User can view source system"
        },
      },
    ]
  },
  {
    name: "Bets",
    info: `It enables the "Bets" menu for users`,
    description: "Analyze potential risks in operations and transactions, and implement preventive measures.",
    view: {
      param: "acc_v_risk_bets",
      value: true,
      description: "User can access bets features"
    },
    items: [
      {
        name: "View Bets ID",
        info: `Enables the user to view bets ID information.`,
        view: {
          param: "acc_v_bets_id",
          value: true,
          description: "User can view bets ID"
        },
      },
      {
        name: "View Bets Client ID",
        info: `Enables the user to view client ID information in bets.`,
        view: {
          param: "acc_v_bets_client_id",
          value: true,
          description: "User can view bets client ID"
        },
      },
      {
        name: "View Bets Bet ID",
        info: `Enables the user to view bet ID information.`,
        view: {
          param: "acc_v_bets_bet_id",
          value: true,
          description: "User can view bets bet ID"
        },
      },
      {
        name: "View Bets External Brand",
        info: `Enables the user to view external brand information in bets.`,
        view: {
          param: "acc_v_bets_external_brand",
          value: true,
          description: "User can view bets external brand"
        },
      },
      {
        name: "View Bets External User ID",
        info: `Enables the user to view external user ID information in bets.`,
        view: {
          param: "acc_v_bets_external_user_id",
          value: true,
          description: "User can view bets external user ID"
        },
      },
      {
        name: "View Bets Type",
        info: `Enables the user to view bet type information.`,
        view: {
          param: "acc_v_bets_bet_type",
          value: true,
          description: "User can view bets bet type"
        },
      },
      {
        name: "View Bets Category",
        info: `Enables the user to view bet category information.`,
        view: {
          param: "acc_v_bets_bet_category",
          value: true,
          description: "User can view bets bet category"
        },
      },
      {
        name: "View Bets Amount",
        info: `Enables the user to view bet amount information.`,
        view: {
          param: "acc_v_bets_bet_amount",
          value: true,
          description: "User can view bets bet amount"
        },
      },
      {
        name: "View Bets Win Amount",
        info: `Enables the user to view bet win amount information.`,
        view: {
          param: "acc_v_bets_win_amount",
          value: true,
          description: "User can view bets win amount"
        },
      },
      {
        name: "View Bets Potential Win",
        info: `Enables the user to view bet potential win information.`,
        view: {
          param: "acc_v_bets_potential_win",
          value: true,
          description: "User can view bets potential win"
        },
      },
      {
        name: "View Bets Currency",
        info: `Enables the user to view bet currency information.`,
        view: {
          param: "acc_v_bets_currency",
          value: true,
          description: "User can view bets currency"
        },
      },
      {
        name: "View Bets Status",
        info: `Enables the user to view bet status information.`,
        view: {
          param: "acc_v_bets_status",
          value: true,
          description: "User can view bets status"
        },
      },
      {
        name: "View Bets Settlement Status",
        info: `Enables the user to view bet settlement status information.`,
        view: {
          param: "acc_v_bets_settlement_status",
          value: true,
          description: "User can view bets settlement status"
        },
      },
      {
        name: "View Bets Total Odds",
        info: `Enables the user to view bet total odds information.`,
        view: {
          param: "acc_v_bets_total_odds",
          value: true,
          description: "User can view bets total odds"
        },
      },
      {
        name: "View Bets Selection Count",
        info: `Enables the user to view bet selection count information.`,
        view: {
          param: "acc_v_bets_selection_count",
          value: true,
          description: "User can view bets selection count"
        },
      },
      {
        name: "View Bets Account ID",
        info: `Enables the user to view bet account ID information.`,
        view: {
          param: "acc_v_bets_account_id",
          value: true,
          description: "User can view bets account ID"
        },
      },
      {
        name: "View Bets Desk ID",
        info: `Enables the user to view bet desk ID information.`,
        view: {
          param: "acc_v_bets_desk_id",
          value: true,
          description: "User can view bets desk ID"
        },
      },
      {
        name: "View Bets Platform",
        info: `Enables the user to view bet platform information.`,
        view: {
          param: "acc_v_bets_platform",
          value: true,
          description: "User can view bets platform"
        },
      },
      {
        name: "View Bets Timing",
        info: `Enables the user to view bet timing information.`,
        view: {
          param: "acc_v_bets_timing",
          value: true,
          description: "User can view bets timing"
        },
      },
      {
        name: "View Bets Bet Date",
        info: `Enables the user to view bet date information.`,
        view: {
          param: "acc_v_bets_bet_date",
          value: true,
          description: "User can view bets bet date"
        },
      },
      {
        name: "View Bets Settlement Date",
        info: `Enables the user to view bet settlement date information.`,
        view: {
          param: "acc_v_bets_settlement_date",
          value: true,
          description: "User can view bets settlement date"
        },
      },
      {
        name: "View Bets Real Balance Before",
        info: `Enables the user to view bet real balance before information.`,
        view: {
          param: "acc_v_bets_real_balance_before",
          value: true,
          description: "User can view bets real balance before"
        },
      },
      {
        name: "View Bets Real Balance After",
        info: `Enables the user to view bet real balance after information.`,
        view: {
          param: "acc_v_bets_real_balance_after",
          value: true,
          description: "User can view bets real balance after"
        },
      },
      {
        name: "View Bets Bonus Balance Before",
        info: `Enables the user to view bet bonus balance before information.`,
        view: {
          param: "acc_v_bets_bonus_balance_before",
          value: true,
          description: "User can view bets bonus balance before"
        },
      },
      {
        name: "View Bets Bonus Balance After",
        info: `Enables the user to view bet bonus balance after information.`,
        view: {
          param: "acc_v_bets_bonus_balance_after",
          value: true,
          description: "User can view bets bonus balance after"
        },
      },
      {
        name: "View Bets Sport Data",
        info: `Enables the user to view bet sport data information.`,
        view: {
          param: "acc_v_bets_sport_data",
          value: true,
          description: "User can view bets sport data"
        },
      },
      {
        name: "View Bets Competitors",
        info: `Enables the user to view bet competitors information.`,
        view: {
          param: "acc_v_bets_competitors",
          value: true,
          description: "User can view bets competitors"
        },
      },
      {
        name: "View Bets Webhook Data",
        info: `Enables the user to view bet webhook data information.`,
        view: {
          param: "acc_v_bets_webhook_data",
          value: true,
          description: "User can view bets webhook data"
        },
      },
      {
        name: "View Bets Description",
        info: `Enables the user to view bet description information.`,
        view: {
          param: "acc_v_bets_description",
          value: true,
          description: "User can view bets description"
        },
      },
      {
        name: "View Bets Is Live",
        info: `Enables the user to view bet live status information.`,
        view: {
          param: "acc_v_bets_is_live",
          value: true,
          description: "User can view bets live status"
        },
      },
      {
        name: "View Bets Is Virtual",
        info: `Enables the user to view bet virtual status information.`,
        view: {
          param: "acc_v_bets_is_virtual",
          value: true,
          description: "User can view bets virtual status"
        },
      },
      {
        name: "View Bets Is Cash Out",
        info: `Enables the user to view bet cash out status information.`,
        view: {
          param: "acc_v_bets_is_cash_out",
          value: true,
          description: "User can view bets cash out status"
        },
      },
      {
        name: "View Bets Event Date",
        info: `Enables the user to view bet event date information.`,
        view: {
          param: "acc_v_bets_event_date",
          value: true,
          description: "User can view bets event date"
        },
      },
      {
        name: "View Bets Source System",
        info: `Enables the user to view bet source system information.`,
        view: {
          param: "acc_v_bets_source_system",
          value: true,
          description: "User can view bets source system"
        },
      },
      {
        name: "View Bets Processing Status",
        info: `Enables the user to view bet processing status information.`,
        view: {
          param: "acc_v_bets_processing_status",
          value: true,
          description: "User can view bets processing status"
        },
      },
      {
        name: "View Bets Created At",
        info: `Enables the user to view bet creation date information.`,
        view: {
          param: "acc_v_bets_created_at",
          value: true,
          description: "User can view bets creation date"
        },
      },
      {
        name: "Edit Bets",
        info: `Enables the user to edit bets information.`,
        edit: {
          param: "acc_e_bets",
          value: true,
          description: "User can edit bets"
        },
      },
        {
          name: "Delete Bets",
          info: `Enables the user to delete bets.`,
          edit: {
            param: "acc_e_delete_bets",
            value: true,
            description: "User can delete bets"
          },
        },
        {
          name: "Create Bets",
          info: `Enables the user to create bets.`,
          edit: {
            param: "acc_e_create_bets",
            value: true,
            description: "User can create bets"
          },
        },
    ],
  },
  {
    name: "Compliance",
    info: `It enables the "Compliance" menu for users`,
    description: "Analyze potential risks in operations and transactions, and implement preventive measures.",
    view: {
      param: "acc_v_audit_compliance_regulation",
      value: false,
      description: "User can access compliance and regulation features"
    },
    items: [
      {
        name: "Compliance",
        info: `Enables the user to access "Compliance" section under "Compliance & Regulation Audit" menu.`,
        view: {
          param: "acc_v_audit_compliance",
          value: false,
          description: "User can view compliance audit information"
        },
      },
      // {
      //   name: "Regulatory Report",
      //   info: `Enables the user to access "Regulatory Report" section under "Compliance & Regulation Audit" menu.`,
      //   view: {
      //     param: "acc_v_audit_regulatory_report",
      //     value: false,
      //     description: "User can view regulatory compliance reports"
      //   },
      // },
    ]
  },
  {
    name: "Logs",
    info: `It enables the "Logs" menu for agents, where agents can see logs of "Clients, Transactions, Positions, & Comments"`,
    description: "Allows users to view and access system logs.",
    view: {
      param: "acc_v_logs",
      value: false,
      description: "User can access system logs"
    },
  },
  {
    name: "Payment Audit",
    info: "Payment Audit can be made accessible",
    description: "Review and verify transaction records, ensuring accuracy and compliance in financial operations.",
    view: {
      param: "acc_v_payment_audit",
      value: true,
      description: "User can access payment audit features"
    },
    items: [
      {
        name: "Merchant fees & rate",
        edit: {
          param: "acc_e_audit_merchant",
          value: true,
          description: "User can edit merchant fees and rates"
        },
        view: {
          param: "acc_v_audit_merchant",
          value: true,
          description: "User can view merchant fees and rates"
        },
      },
      {
        name: "Bank provider",
        edit: {
          param: "acc_e_audit_bank",
          value: true,
          description: "User can edit bank provider information"
        },
        view: {
          param: "acc_v_audit_bank",
          value: true,
          description: "User can view bank provider information"
        },
      },
      {
        name: "Payment type",
        edit: {
          param: "acc_e_audit_payment_type",
          value: true,
          description: "User can edit payment type settings"
        },
        view: {
          param: "acc_v_audit_payment_type",
          value: true,
          description: "User can view payment type settings"
        }
      },
      {
        name: "Validation tasks",
        edit: {
          param: "acc_e_audit_tasks",
          value: true,
          description: "User can edit validation task settings"
        },
        view: {
          param: "acc_v_audit_tasks",
          value: true,
          description: "User can view validation task settings"
        },
      },
      {
        name: "Data entry",
        edit: {
          param: "acc_e_audit_data",
          value: true,
          description: "User can edit audit data entries"
        },
        view: {
          param: "acc_v_audit_data",
          value: true,
          description: "User can view audit data entries"
        },
      }
    ]
  },
  {
    name: "Calendar",
    info: `It enables the "Calendar" menu`,
    description: "Allows users to view and access the calendar.",
    view: {
      param: "acc_v_calendar",
      value: true,
      description: "User can access calendar features"
    },
    items: [
      {
        name: "Can view all agents calendar event",
        info: `It enables agent to see all other agents calendar events`,
        description: "Allows users to view and access the calendar.",
        view: {
          param: "acc_v_all_agents_calendar",
          value: false,
          description: "User can view calendar events for all agents"
        },
      },
    ],
  },
  {
    name: "Wallet",
    info: `It enables the "Wallet" menu for agents, where agents can send/receive/swap the crypto currency`,
    description: "Coming soon",
    view: {
      param: "acc_v_wallet",
      value: true,
      description: "User can access wallet features"
    }
  },
  {
    name: "Article",
    info: `It enables the "Article" menu for agents, where agents can view the articles`,
    description: "Access and manage informational content and updates; ideal for internal knowledge bases or customer FAQs.",
    view: {
      param: "acc_v_article",
      value: true,
      description: "User can access article management features"
    },
    items: [
      {
        name: "Article edit",
        info: `It allows agents to create articles & make changes to articles`,
        edit: {
          param: "acc_e_article",
          value: true,
          description: "User can create and edit articles"
        }
      }
    ]
  },
  {
    name: "Company Emails",
    info: `It enables the "Emails" tab under settings menu for agent`,
    description: "Allows users to access company email settings.",
    view: {
      param: "acc_v_settings_emails",
      value: true,
      description: "User can access company email settings"
    },
    items: [],
  },
  {
    name: "Agent Email",
    info: `It allows agents to use their own email address as the sender of the email`,
    description: "Allows agents to use their own email address as the sender of the email.",
    view: {
      param: "acc_v_agent_email",
      value: true,
      description: "User can use their own email as sender address"
    },
    items: [],
  },
  {
    name: "Settings",
    info: "Settings menu can be made accessible",
    description: "Configure system preferences, update user permissions, and customize operational parameters.",
    view: {
      param: "acc_v_settings",
      value: true,
      description: "User can access system settings"
    },
    items: [
      {
        name: "Team and members",
        info: `It enables the "Team and Members" tab under settings menu, from where agents can invite new agents, create Skill team & Desk, create role templates`,
        edit: {
          param: "acc_e_setting_team",
          value: true,
          description: "User can manage team and member settings"
        },
      },
      {
        name: "Platform setting",
        info: `It enables the "Platform settings" tab under settings menu for agent`,
        edit: {
          param: "acc_e_setting_platform",
          value: true,
          description: "User can manage platform settings"
        },
      },
      {
        name: "Mini-chat",
        info: `It enables the "Mini-chat" tab under settings menu for agent`,
        edit: {
          param: "acc_e_setting_chat",
          value: true,
          description: "User can manage mini-chat settings"
        },
      },
      {
        name: "Email templates",
        info: `It enables the "Email templates" tab under settings emails menu for agent`,
        edit: {
          param: "acc_e_settings_email_templates",
          value: true,
          description: "User can manage email templates"
        },
      },
      {
        name: "Can bulk invite agents",
        info: `It enables access to user to invite bulk users to the CRM`,
        edit: {
          param: "acc_e_client_bulk_invite",
          value: false,
          description: "User can invite multiple agents at once"
        }
      },
      {
        name: "Can add agent",
        info: `It enables access to user to invite agent to the CRM`,
        edit: {
          param: "acc_e_add_agent",
          value: true,
          description: "User can add new agents to the system"
        }
      },
      {
        name: "Can add Ip",
        info: `It enables access to user to set the whitelist ip`,
        edit: {
          param: "acc_e_add_ip",
          value: true,
          description: "User can add IP addresses to whitelist"
        }
      },
      {
        name: "Installation",
        info: `It enables the "Installation" tab under settings menu for agent`,
        edit: {
          param: "acc_e_setting_installation",
          value: true,
          description: "User can manage installation settings"
        },
      },
      {
        name: "License",
        info: `It enables the "License" tab under settings menu for agent`,
        edit: {
          param: "acc_e_setting_license",
          value: true,
          description: "User can manage license settings"
        },
      },
      {
        name: "Trader",
        info: `It enables the "Trader" tab under settings menu for agent, where agents can control the access of trading dashboard`,
        edit: {
          param: "acc_e_setting_trader",
          value: true,
          description: "User can manage trader settings"
        }
      },
      {
        name: "Agent Real Trading Account",
        info: `It enables the "Agent Real Trading Account" tab under settings menu for agent, where agents can control the access of real trading account`,
        edit: {
          param: "acc_e_agent_real_acc",
          value: true,
          description: "Agent can manage real trading account settings"
        }
      },
      {
        name: "Agent Real Trading Account Extra",
        info: `It enables the "Agent Real Trading Account Extra" tab under settings menu for agent, where agents can control the access of real trading account extra`,
        edit: {
          param: "acc_e_agent_real_acc_extra",
          value: true,
          description: "Agent can manage real trading account extra settings"
        }
      },
      {
        name: "Agent Demo Trading Account",
        info: `It enables the "Agent Demo Trading Account" tab under settings menu for agent, where agents can control the access of demo trading account`,
        edit: {
          param: "acc_e_agent_demo_acc",
          value: true,
          description: "Agent can manage demo trading account settings",
        }
      },
      {
        name: "Agent Demo Trading Account Extra",
        info: `It enables the "Agent Demo Trading Account Extra" tab under settings menu for agent, where agents can control the access of demo trading account extra`,
        edit: {
          param: "acc_e_agent_demo_acc_extra",
          value: true,
          description: "Agent can manage demo trading account extra settings"
        }
      },
      {
        name: "Agent Trading Account Name",
        info: `It enables the "Agent Trading Account Name" tab under settings menu for agent, where agents can control the access of trading account name`,
        edit: {
          param: "acc_e_agent_t_account_name",
          value: true,
          description: "Agent can manage trading account name settings"
        }
      },
      {
        name: "Client dashboard",
        info: `It enables the "Client dashboard Setting" tab under settings menu for agent, where agents can control the access of Client dashboard`,
        edit: {
          param: "acc_e_setting_client_dashboard",
          value: true,
          description: "User can manage client dashboard settings"
        }
      },
      {
        name: "Announcements",
        info: `It enables the "Announcements Setting" tab under settings menu for agent, where agents can control the access of Announcements`,
        edit: {
          param: "acc_e_setting_announcements",
          value: true,
          description: "User can manage announcement settings"
        }
      },
      {
        name: "WhatsApp",
        info: `It enables the "WhatsApp" tab under settings menu for agent, where agents can control the access of WhatsApp`,
        edit: {
          param: "acc_e_settings_whatsapp",
          value: true,
          description: "User can manage WhatsApp settings"
        }
      },
      {
        name: "Forms",
        info: `It enables the "Forms Setting" tab under settings menu for agent, where agents can control the access of Forms`,
        edit: {
          param: "acc_e_setting_forms",
          value: true,
          description: "User can manage form settings"
        }
      },
    ]
  },
  {
    name: "Integration",
    info: `It enables the "Integration" menu for user, where agents can see Integration`,
    description: "Allows users to view and access Integration.",
    view: {
      param: "acc_v_integration",
      value: false,
      description: "User can access Integration"
    },
    items: [
      {
        name: "Call system",
        info: `It enables the "Call System" tab under settings menu for agent, where agents can integrate listed telephony with CRM`,
        edit: {
          param: "acc_e_setting_call",
          value: true,
          description: "User can manage call system settings"
        }
      },
      {
        name: "Payment system",
        info: `It enables the "Payment System" tab under settings menu for agent, where agents can integrate payment system with CRM`,
        edit: {
          param: "acc_e_integration_payment",
          value: true,
          description: "User can manage payment system settings"
        }
      },
      {
        name: "Coperato phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_coperato_numbers",
          value: false,
          description: "User can view Coperato phone numbers"
        },
      },
      {
        name: "Voiso phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_voiso_numbers",
          value: false,
          description: "User can view Voiso phone numbers"
        },
      },
      {
        name: "Didglobal phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_didglobal_numbers",
          value: false,
          description: "User can view Didglobal phone numbers"
        },
      },
      {
        name: "Commpeak phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_commpeak_numbers",
          value: false,
          description: "User can view Commpeak phone numbers"
        },
      },
      {
        name: "Squaretalk phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_squaretalk_numbers",
          value: false,
          description: "User can view Squaretalk phone numbers"
        },
      },
      {
        name: "Voicespin phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_voicespin_numbers",
          value: false,
          description: "User can view Voicespin phone numbers"
        },
      },
      {
        name: "Cyprus P.B.X phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_cy_pbx_numbers",
          value: false,
          description: "User can view Cyprus pbx phone numbers"
        },
      },
      {
        name: "Twilio phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_twilio_numbers",
          value: false,
          description: "User can view Twilio phone numbers"
        },
      },
      {
        name: "Prime Voip phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_prime_voip_numbers",
          value: false,
          description: "User can view Prime Voip phone numbers"
        },
      },
      {
        name: "MMDSmart phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_mmdsmart_numbers",
          value: false,
          description: "User can view MMDSmart phone numbers"
        },
      },
      {
        name: "Perfect Money phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_perfect_money_numbers",
          value: false,
          description: "User can view Perfect Money phone numbers"
        },
      },
      {
        name: "Nuvei phone numbers",
        info: `Display the company's phone numbers and let the agent pick before making the call`,
        view: {
          param: "acc_v_nuvei_numbers",
          value: false,
          description: "User can view Nuvei phone numbers"
        },
      },
    ],
  },
  {
    name: "Reports",
    info: `It enables the "Report" menu for user, where agents can see Analytics dashboard`,
    description: "Allows users to view and access analytics reports.",
    view: {
      param: "acc_v_reports",
      value: true,
      description: "User can access analytics reports"
    },
    items: [
      {
        name: "Agent Performance",
        info: `It enables agent to see agent performance reports`,
        description: "Allows users to view and access agent performance reports.",
        view: {
          param: "acc_v_reports_agent_performance",
          value: true,
          description: "User can view agent performance reports"
        },
      },
      {
        name: "Affiliate Performance",
        info: `It enables agent to see affiliate performance reports`,
        description: "Allows users to view and access affiliate performance reports.",
        view: {
          param: "acc_v_reports_affiliate_performance",
          value: true,
          description: "User can view affiliate performance reports"
        },
      },
      {
        name: "Desk Performance",
        info: `It enables agent to see desk performance reports`,
        description: "Allows users to view and access desk performance reports.",
        view: {
          param: "acc_v_reports_desk_performance",
          value: true,
          description: "User can view desk performance reports"
        },
      },
      {
        name: "Client Security",
        info: `It enables agent to see client security reports`,
        description: "Allows users to view and access client security reports.",
        view: {
          param: "acc_v_reports_client_security",
          value: true,
          description: "User can view client security reports"
        },
      },
      {
        name: "Agent Security",
        info: `It enables agent to see agent security reports`,
        description: "Allows users to view and access agent security reports.",
        view: {
          param: "acc_v_reports_agent_security",
          value: true,
          description: "User can view agent security reports"
        },
      },
      {
        name: "Power BI",
        info: `It enables agent to see Power BI reports`,
        description: "Allows users to view and access Power BI reports.",
        view: {
          param: "acc_v_reports_power_bi",
          value: true,
          description: "User can view Power BI reports"
        },
      },
      {
        name: "Metabase",
        info: `Its enables agent to see Metabase`,
        view: {
          param: "acc_v_reports_metabase",
          value: true,
          description: "User can view Metabase"
        },
      },
    ],
  },
  {
    name: "Submitted Forms",
    info: `It enables the "Submitted Forms" menu for user, where agents can see Submitted Forms`,
    description: "Allows users to view and access Submitted Forms.",
    view: {
      param: "acc_v_submitted_forms",
      value: true,
      description: "User can access Submitted Forms"
    },
  },
  {
    name: "AI Questions",
    info: `It enables the "AI Questions" menu for user, where agents can see AI Questions`,
    description: "Allows users to view and access AI questions.",
    view: {
      param: "acc_v_ai_questions",
      value: false,
      description: "User can access AI questions"
    },
  },
];