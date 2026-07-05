"use client";

import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
} from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" label="Questão" />
        <TextField source="textoApoio" label="Apoio" />
        <SelectField
          source="type"
          label="Tipo"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "TRUE_FALSE", name: "TRUE_FALSE" },
            { id: "MULTIPLE_CORRECT", name: "MULTIPLE_CORRECT" },
            { id: "TEXT_PASSAGE", name: "TEXT_PASSAGE" },
          ]}
        />
        <ReferenceField source="lessonId" reference="lessons" label="Aula" />
        <NumberField source="order" label="Ordem" />
      </Datagrid>
    </List>
  );
};
