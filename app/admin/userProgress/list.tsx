"use client";

import {
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

const UserProgressFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput source="activeCourseId" reference="courses" label="Curso" />
  </Filter>
);

export const UserProgressList = () => {
  return (
    <List filters={<UserProgressFilter />}>
      <Datagrid rowClick="edit">
        <TextField source="userId" label="Usuário" />
        <TextField source="userName" label="Nome" />
        <ImageField source="userImageSrc" label="Avatar" />
        <ReferenceField source="activeCourseId" reference="courses" label="Curso" />
        <NumberField source="points" label="Pontos" />
      </Datagrid>
    </List>
  );
};
