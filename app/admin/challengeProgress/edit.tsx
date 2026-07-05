"use client";

import {
  BooleanInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const ChallengeProgressEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="userId" label="ID do Usuário" disabled />
        <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
        <BooleanInput source="completed" label="Completo" />
      </SimpleForm>
    </Edit>
  );
};
