"use client";

import {
  BooleanInput,
  Create,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeProgressCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" fullWidth />
        <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
        <BooleanInput source="completed" label="Completo" />
      </SimpleForm>
    </Create>
  );
};
