"use client";

import { Datagrid, List, NumberField, TextField } from "react-admin";

export const UserSubscriptionList = () => {
  return (
    <List>
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
