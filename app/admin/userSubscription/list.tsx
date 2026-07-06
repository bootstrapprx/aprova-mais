"use client";

import {
  Datagrid,
  Filter,
  List,
  NumberField,
  SearchInput,
  TextField,
} from "react-admin";

const UserSubscriptionFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

export const UserSubscriptionList = () => {
  return (
    <List filters={<UserSubscriptionFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="userId" label="Usuário" />
        <TextField source="stripeCustomerId" label="Customer Stripe" />
        <TextField source="stripeSubscriptionId" label="Subscription Stripe" />
        <TextField source="stripePriceId" label="Price ID" />
        <TextField source="stripeCurrentPeriodEnd" label="Fim do Período" />
      </Datagrid>
    </List>
  );
};
