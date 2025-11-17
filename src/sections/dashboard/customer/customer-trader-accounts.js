import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { CustomerCreateTraderAccount } from "./customer-create-trader-account";
import { Iconify } from 'src/components/iconify';
import { customersApi } from "src/api/customers";
import { DeleteModal } from "src/components/customize/delete-modal";
import { useAuth } from "src/hooks/use-auth";
import { useBalance } from "./customer-balance";
import { CreateTransferFundModal } from './customer-transfer-fund-modal';
import { currencyFlagMap, currencyOption } from "src/utils/constant";
import { useInternalBrands } from "src/hooks/custom/use-brand";
import { CustomerPasswordDialog } from './customer-password-dialog';

export const useTraderAccounts = (customerId, ib = false) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAccounts = async () => {
    try {
      setIsLoading(true);
      const params = {
        client_id: customerId,
      };
      if (ib) {
        params.ib_account = ib;
      }
      const { trading_accounts } = await customersApi.getTraderAccounts(params);
      setAccounts(trading_accounts ?? []);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, [customerId]);

  return {
    accounts,
    getAccounts,
    isLoading,
  };
};

const useGetAccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([]);

  const getAccountTypes = async () => {
    try {
      const { account_types } = await customersApi.getAccountTypes();
      setAccountTypes(account_types?.map(at => ({ value: at?.id, label: at?.name })));
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getAccountTypes();
  }, []);

  return accountTypes;
}

export const CustomerTraderAccounts = ({ customerId, currentEnabledBrandCurrencies, customerInfo }) => {
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState();
  const [accountToDelete, setAccountToDelete] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const { user, company } = useAuth();
  const { accounts, getAccounts } = useTraderAccounts(customerId);
  const { internalBrandsInfo: brandsInfo } = useInternalBrands();

  const { balance } = useBalance();

  const accountTypes = useGetAccountTypes();

  const internalBrand = useMemo(() => {
    return brandsInfo?.find(brand => brand.id === customerInfo?.client?.internal_brand_id);
  }, [brandsInfo, customerInfo]);

  const canCreateRealAccount = useMemo(() => {
    if (user?.acc?.acc_e_agent_real_acc === false || internalBrand?.agent_real_acc === false) {
      return false;
    }
    return user?.acc?.acc_e_agent_real_acc_extra !== false && internalBrand?.agent_real_acc_extra !== false;
  }, [user, internalBrand]);

  const canCreateDemoAccount = useMemo(() => {
    if (user?.acc?.acc_e_agent_demo_acc === false || internalBrand?.agent_demo_acc === false) {
      return false;
    }
    return user?.acc?.acc_e_agent_demo_acc_extra !== false && internalBrand?.agent_demo_acc_extra !== false;
  }, [user, internalBrand]);

  const realAccountsCount = useMemo(() => {
    return accounts?.filter(account => !account.demo).length || 0;
  }, [accounts]);

  const demoAccountsCount = useMemo(() => {
    return accounts?.filter(account => account.demo).length || 0;
  }, [accounts]);

  const hasBasicRealPermission = useMemo(() => {
    return user?.acc?.acc_e_agent_real_acc !== false && internalBrand?.agent_real_acc !== false;
  }, [user, internalBrand]);

  const hasBasicDemoPermission = useMemo(() => {
    return user?.acc?.acc_e_agent_demo_acc !== false && internalBrand?.agent_demo_acc !== false;
  }, [user, internalBrand]);

  const shouldShowAddButton = useMemo(() => {
    if (!internalBrand) return false;

    if (!hasBasicRealPermission && !hasBasicDemoPermission) return false;

    const canCreateReal = hasBasicRealPermission && 
      (canCreateRealAccount || realAccountsCount < (internalBrand.max_trading_account || 0));
    const canCreateDemo = hasBasicDemoPermission && 
      (canCreateDemoAccount || demoAccountsCount < (internalBrand.max_trading_account_demo || 0));

    return canCreateReal || canCreateDemo;
  }, [internalBrand, canCreateRealAccount, canCreateDemoAccount, realAccountsCount, demoAccountsCount, hasBasicRealPermission, hasBasicDemoPermission]);

  const handleDeleteAccount = async () => {
    try {
      await customersApi.deleteTraderAccount(accountToDelete);
      toast.success("Trader account succesfully deleted!");
      setTimeout(() => {
        getAccounts();
      }, 1000);
      setAccountToDelete(null);
      setOpenDeleteAccount(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack
        alignItems="center"
        justifyContent="flex-end"
        direction="row"
        spacing={2}
      >
        <Button
          startIcon={(
            <SvgIcon>
              <Iconify icon="solar:transfer-horizontal-bold" />
            </SvgIcon>
          )}
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={{ 
            minWidth: 180,
            height: 46 
          }}
        >
          Transfer Fund
        </Button>
        {shouldShowAddButton && (
          <Button
            startIcon={<Iconify icon="lucide:plus" width={24} />}
            variant="contained"
            onClick={() => setOpenCreateAccount(true)}
            sx={{ 
              minWidth: 180,
              height: 46 
            }}
          >
            {company?.company_type === 2 ? "Add Platform Account" : "Add Trader Account"}
          </Button>
        )}
      </Stack>
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Hide</TableCell>
                <TableCell>Demo</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Account type</TableCell>
                {user?.acc?.acc_v_mt_passwords !== false && (
                  <TableCell align="right">Main Password</TableCell>
                )}
                {user?.acc?.acc_v_mt_passwords !== false && (
                  <TableCell align="right">Investor Password</TableCell>
                )}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts?.map((account) => {
                return (
                  <TableRow hover key={account?.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography>{account?.name ?? "n/a"}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {account?.main ? null: (account?.active ? (
                        <Iconify icon="ic:baseline-check" color="success.main" width={22}/>
                      ) : (
                        <Iconify icon="gravity-ui:xmark" color="error.dark" width={22}/>
                      ))}
                    </TableCell>
                    <TableCell>
                      {account?.main ? null: (account?.hide ? (
                        <Iconify icon="ic:baseline-check" color="success.main" width={22}/>
                      ) : (
                        <Iconify icon="gravity-ui:xmark" color="error.dark" width={22}/>
                      ))}
                    </TableCell>
                    <TableCell>
                      {account?.demo ? (
                        <Iconify icon="ic:baseline-check" color="success.main" width={22}/>
                      ) : (
                        <Iconify icon="gravity-ui:xmark" color="error.dark" width={22}/>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon={account?.currency ? currencyFlagMap[account?.currency] : currencyFlagMap[1]} />
                        <Typography variant="subtitle2">
                          {account?.currency ? currencyOption?.find((currency) => currency?.value === account?.currency)?.name : "USD"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{balance?.[account?.id]?.balance ?? ""}</TableCell>
                    <TableCell>{accountTypes?.find(at => at?.value == account?.t_account_type_id)?.label ?? "n/a"}</TableCell>
                    {user?.acc?.acc_v_mt_passwords !== false && (
                      <TableCell align="right">{account?.main_password ?? "n/a"}</TableCell>
                    )}
                    {user?.acc?.acc_v_mt_passwords !== false && (
                      <TableCell align="right">{account?.investor_password ?? "n/a"}</TableCell>
                    )}
                    <TableCell align="right">
                      {account?.main ? null : (
                        <>
                          <IconButton
                            onClick={() => {
                              setAccountToEdit(account);
                              setOpenCreateAccount(true);
                            }}
                            sx={{ '&:hover': { color: 'primary.main' }}}
                          >
                            <Iconify icon="mage:edit" width={24}/>
                          </IconButton>
                          {user?.acc?.acc_e_mt_passwords !== false && account?.provider === "mt" && (
                            <IconButton
                              onClick={() => {
                                setSelectedAccountId(account.id);
                                setPasswordDialogOpen(true);
                              }}
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="solar:key-bold" width={24}/>
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <CustomerCreateTraderAccount
        open={openCreateAccount}
        onClose={() => {
          setOpenCreateAccount(false);
          setAccountToEdit(null);
        }}
        onGetAccounts={getAccounts}
        customerId={customerId}
        isEdit={!!accountToEdit}
        account={accountToEdit}
        accountTypes={accountTypes}
        currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
        accountPermissions={{
          canCreateReal: hasBasicRealPermission && (canCreateRealAccount || realAccountsCount < (internalBrand?.max_trading_account || 0)),
          canCreateDemo: hasBasicDemoPermission && (canCreateDemoAccount || demoAccountsCount < (internalBrand?.max_trading_account_demo || 0)),
          hasExtraReal: canCreateRealAccount,
          hasExtraDemo: canCreateDemoAccount,
          hasBasicRealPermission,
          hasBasicDemoPermission
        }}
        user={user}
        internal_brand={internalBrand}
      />

      <DeleteModal
        isOpen={openDeleteAccount}
        setIsOpen={setOpenDeleteAccount}
        onDelete={handleDeleteAccount}
        title="Delete Trader Account"
        description="Are you sure you want to delete this trader account?"
      />

      <CreateTransferFundModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customerId={customerId}
        currentEnabledBrandCurrencies={currentEnabledBrandCurrencies}
      />

      <CustomerPasswordDialog
        open={passwordDialogOpen}
        customerId={customerId}
        onClose={() => {
          setPasswordDialogOpen(false);
          setSelectedAccountId(null);
        }}
        accountId={selectedAccountId}
        account={accounts?.find(account => account?.id === selectedAccountId)}
      />
    </Stack>
  );
};
