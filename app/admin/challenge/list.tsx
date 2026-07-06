"use client";

import {
  Datagrid,
  Filter,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  SelectField,
  SelectInput,
  TextField,
} from "react-admin";

const CHALLENGE_TYPE_CHOICES = [
  { id: "SELECT", name: "SELECT" },
  { id: "TRUE_FALSE", name: "TRUE_FALSE" },
  { id: "MULTIPLE_CORRECT", name: "MULTIPLE_CORRECT" },
  { id: "TEXT_PASSAGE", name: "TEXT_PASSAGE" },
];

const ChallengeFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <SelectInput source="type" label="Tipo" choices={CHALLENGE_TYPE_CHOICES} />
    <ReferenceInput source="lessonId" reference="lessons" label="Aula" />
  </Filter>
);

export const ChallengeList = () => {
  return (
    <List filters={<ChallengeFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" label="Questão" />
        <TextField source="textoApoio" label="Apoio" />
        <SelectField
          source="type"
          label="Tipo"
          choices={CHALLENGE_TYPE_CHOICES}
        />
        <ReferenceField source="lessonId" reference="lessons" label="Aula" />
        <NumberField source="order" label="Ordem" />
      </Datagrid>
    </List>
  );
};
