"use client";

import {
  BooleanInput,
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeProgressCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" />
        <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
        <BooleanInput source="completed" label="Completo" defaultValue={false} />
      </SimpleForm>
    </Create>
  );
};
