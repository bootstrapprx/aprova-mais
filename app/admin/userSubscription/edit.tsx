"use client";

import {
  DateTimeInput,
  Edit,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UserSubscriptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="userId" label="ID do Usuário" disabled />
        <TextInput source="stripeCustomerId" validate={[required()]} label="Customer ID (Stripe)" fullWidth />
        <TextInput source="stripeSubscriptionId" validate={[required()]} label="Subscription ID (Stripe)" fullWidth />
        <TextInput source="stripePriceId" validate={[required()]} label="Price ID (Stripe)" fullWidth />
        <DateTimeInput source="stripeCurrentPeriodEnd" validate={[required()]} label="Fim do Período" fullWidth />
      </SimpleForm>
    </Edit>
  );
};
