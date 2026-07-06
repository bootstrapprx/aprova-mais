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

const LessonFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput source="unitId" reference="units" label="Unidade" />
  </Filter>
);

export const LessonList = () => {
  return (
    <List filters={<LessonFilter />}>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" label="Título" />
        <ReferenceField source="unitId" reference="units" label="Unidade" />
        <NumberField source="order" label="Ordem" />
      </Datagrid>
    </List>
  );
};
