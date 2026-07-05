"use client";

import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const ChallengeProgressList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="userId" label="Usuário" />
        <ReferenceField source="challengeId" reference="challenges" label="Questão" />
        <BooleanField source="completed" label="Completo" />
      </Datagrid>
    </List>
  );
};
