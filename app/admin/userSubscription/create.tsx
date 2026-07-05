"use client";

import {
  Create,
  DateTimeInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UserSubscriptionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" fullWidth />
        <TextInput source="stripeCustomerId" validate={[required()]} label="Customer ID (Stripe)" fullWidth />
        <TextInput source="stripeSubscriptionId" validate={[required()]} label="Subscription ID (Stripe)" fullWidth />
        <TextInput source="stripePriceId" validate={[required()]} label="Price ID (Stripe)" fullWidth />
        <DateTimeInput source="stripeCurrentPeriodEnd" validate={[required()]} label="Fim do Período" fullWidth />
      </SimpleForm>
    </Create>
  );
};
