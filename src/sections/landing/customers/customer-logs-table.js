import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { format } from "date-fns";
import Stack from "@mui/material/Stack";
import { Scrollbar } from "src/components/scrollbar";

import { useMemo, useState } from "react";

const logMockedList = {
  Email: [
    {
      id: 1,
      account_name: "Michael Lee",
      field: "email_address",
      before: "michael.lee@gmail.com",
      after: "m.lee.updated@gmail.com"
    },
    {
      id: 2,
      account_name: "Sophia Chen",
      field: "email_address",
      before: "sophia.c@gmail.net",
      after: "sophia.chen@newmail.com"
    },
    {
      id: 3,
      account_name: "Daniel Kim",
      field: "email_address",
      before: "daniel.k@gmail.org",
      after: "dkim.updated@gmail.org"
    },
    {
      id: 4,
      account_name: "Emily Wang",
      field: "email_address",
      before: "emily.wang@email.com",
      after: "e.wang@newdomain.com"
    },
    {
      id: 5,
      account_name: "Aiden Nguyen",
      field: "email_address",
      before: "aiden.nguyen@gmail.com",
      after: "aiden.n@newmail.org"
    },
    {
      id: 6,
      account_name: "Emma Rodriguez",
      field: "email_address",
      before: "emma.r@hotmail.com",
      after: "e.rodriguez.updated@hotmail.com"
    },
    {
      id: 7,
      account_name: "Liam Patel",
      field: "email_address",
      before: "liam.patel@email.net",
      after: "liam.patel@newmail.org"
    }
  ],
  PhoneNumber: [
    {
      id: 1,
      account_name: "Mia Brown",
      field: "phone_number",
      before: "+1234567890",
      after: "+1987654321"
    },
    {
      id: 2,
      account_name: "Logan Chen",
      field: "phone_number",
      before: "+9876543210",
      after: "+1122334455"
    },
    {
      id: 3,
      account_name: "Aiden Nguyen",
      field: "phone_number",
      before: "+1122334455",
      after: "+9876543210"
    },
    {
      id: 4,
      account_name: "Emma Garcia",
      field: "phone_number",
      before: "+8765432109",
      after: "+9012345678"
    },
    {
      id: 5,
      account_name: "Oliver Nguyen",
      field: "phone_number",
      before: "+9876543210",
      after: "+1234567890"
    },
    {
      id: 6,
      account_name: "Harper Kim",
      field: "phone_number",
      before: "+1234567890",
      after: "+9876543210"
    },
    {
      id: 7,
      account_name: "Samuel Patel",
      field: "phone_number",
      before: "+8765432109",
      after: "+1122334455"
    }
  ],
  ClientComment: [
    {
      id: 1,
      account_name: "Liam Patel",
      field: "comment",
      before: "Old comment from Liam Patel.",
      after: "Updated comment from Liam Patel."
    },
    {
      id: 2,
      account_name: "Emma Rodriguez",
      field: "comment",
      before: "Initial comment from Emma Rodriguez.",
      after: "Revised comment from Emma Rodriguez."
    },
    {
      id: 3,
      account_name: "Aiden Nguyen",
      field: "comment",
      before: "Previous note by Aiden Nguyen.",
      after: "New note by Aiden Nguyen."
    },
    {
      id: 4,
      account_name: "Sophia Chen",
      field: "comment",
      before: "Comment added by Sophia Chen.",
      after: "Updated comment by Sophia Chen."
    },
    {
      id: 5,
      account_name: "Ethan Kim",
      field: "comment",
      before: "Original remark from Ethan Kim.",
      after: "Revised remark from Ethan Kim."
    },
    {
      id: 6,
      account_name: "Olivia Wang",
      field: "comment",
      before: "Old message from Olivia Wang.",
      after: "New message from Olivia Wang."
    },
    {
      id: 7,
      account_name: "Noah Smith",
      field: "comment",
      before: "Existing comment by Noah Smith.",
      after: "Updated comment by Noah Smith."
    }
  ],
  TTransaction: [
    {
      id: 1,
      account_name: "Ava Smith",
      field: "Transaction Method",
      before: "Purchase",
      after: "Sale"
    },
    {
      id: 2,
      account_name: "Noah Davis",
      field: "Amount",
      before: "$500",
      after: "$750"
    },
    {
      id: 3,
      account_name: "Aiden Nguyen",
      field: "Status",
      before: "Pending",
      after: "Completed"
    },
    {
      id: 4,
      account_name: "Sophia Lee",
      field: "Deposit",
      before: "No",
      after: "Yes"
    },
    {
      id: 5,
      account_name: "Jackson Wang",
      field: "Currency",
      before: "USD",
      after: "EUR"
    },
    {
      id: 6,
      account_name: "Olivia Nguyen",
      field: "Amount",
      before: "$1000",
      after: "$1200"
    },
    {
      id: 7,
      account_name: "Isabella Patel",
      field: "Transaction Method",
      before: "Withdrawal",
      after: "Transfer"
    }
  ],
  Position: [
    {
      id: 1,
      account_name: "Alex Johnson",
      field: "Leverage",
      before: "1:50",
      after: "1:100"
    },
    {
      id: 2,
      account_name: "Maya Turner",
      field: "Amount",
      before: "$5000",
      after: "$7500"
    },
    {
      id: 3,
      account_name: "Ryan Patel",
      field: "Status",
      before: "Open",
      after: "Closed"
    },
    {
      id: 4,
      account_name: "Sophia Chen",
      field: "Alert",
      before: "None",
      after: "Critical"
    },
    {
      id: 5,
      account_name: "Ethan Nguyen",
      field: "Market",
      before: "Forex",
      after: "Commodities"
    },
    {
      id: 6,
      account_name: "Olivia Wang",
      field: "Direction",
      before: "Long",
      after: "Short"
    },
    {
      id: 7,
      account_name: "Lily Chen",
      field: "Leverage",
      before: "1:100",
      after: "1:200"
    }
  ],
};

export const LandingLogsTable = ({
  currentMenu,
}) => {

  const currentLogs = useMemo(() => {
    if (currentMenu) {
      return logMockedList[currentMenu];
    }
  }, [currentMenu]);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  return (
    <>
      <Scrollbar sx={{ maxHeight: 650 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Account Name</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Before</TableCell>
              <TableCell>After</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(
              currentLogs?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log?.id}</TableCell>
                  <TableCell>{log?.account_name}</TableCell>
                  <TableCell>{format(new Date(), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    <Stack>{log?.field}</Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>{log?.before}</Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>{log?.after}</Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={7}
        onPageChange={(event, index) => {
          setCurrentPage(index);
        }}
        onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
        page={currentPage ?? 0}
        rowsPerPage={perPage ?? 10}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
};
