"use client";

import {
  BooleanField,
  BooleanInput,
  Datagrid,
  Filter,
  ImageField,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  TextField,
} from "react-admin";

const ChallengeOptionFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
    <BooleanInput source="correct" label="Correta" />
  </Filter>
);

export const ChallengeOptionsList = () => {
  return (
    <List filters={<ChallengeOptionFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="text" label="Texto" />
        <BooleanField source="correct" label="Correta" />
        <ReferenceField source="challengeId" reference="challenges" label="Questão" />
        <ImageField source="imageSrc" label="Imagem" />
        <TextField source="audioSrc" label="Áudio" />
      </Datagrid>
    </List>
  );
};
