"use client";

import {
  Datagrid,
  Filter,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  TextField,
} from "react-admin";

const UnitFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput source="courseId" reference="courses" label="Curso" />
  </Filter>
);

export const UnitList = () => {
  return (
    <List filters={<UnitFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" label="Título" />
        <TextField source="description" label="Descrição" />
        <ReferenceField source="courseId" reference="courses" label="Curso" />
        <NumberField source="order" label="Ordem" />
      </Datagrid>
    </List>
  );
};
