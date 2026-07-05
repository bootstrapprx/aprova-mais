"use client";

import {
  Edit,
  SimpleForm,
  TextInput,
} from "react-admin";

export const UserSubscriptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="userId" label="ID do Usuário" disabled />
        <TextInput source="stripeCustomerId" label="Customer ID (Stripe)" />
        <TextInput source="stripeSubscriptionId" label="Subscription ID (Stripe)" />
        <TextInput source="stripePriceId" label="Price ID (Stripe)" />
        <TextInput source="stripeCurrentPeriodEnd" label="Fim do Período" />
      </SimpleForm>
    </Edit>
  );
};
