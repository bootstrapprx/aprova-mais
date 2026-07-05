"use client";

import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UserSubscriptionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" />
        <TextInput source="stripeCustomerId" validate={[required()]} label="Customer ID (Stripe)" />
        <TextInput source="stripeSubscriptionId" validate={[required()]} label="Subscription ID (Stripe)" />
        <TextInput source="stripePriceId" validate={[required()]} label="Price ID (Stripe)" />
        <TextInput source="stripeCurrentPeriodEnd" validate={[required()]} label="Fim do Período" />
      </SimpleForm>
    </Create>
  );
};
