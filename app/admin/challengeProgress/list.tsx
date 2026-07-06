"use client";

import {
  BooleanField,
  BooleanInput,
  Datagrid,
  Filter,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const ChallengeProgressFilter = () => (
  <Filter>
    <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
    <BooleanInput source="completed" label="Completo" />
  </Filter>
);

export const ChallengeProgressList = () => {
  return (
    <List filters={<ChallengeProgressFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="userId" label="Usuário" />
        <ReferenceField source="challengeId" reference="challenges" label="Questão" />
        <BooleanField source="completed" label="Completo" />
      </Datagrid>
    </List>
  );
};
