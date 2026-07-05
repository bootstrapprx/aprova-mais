"use client";

import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const LessonList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" label="Título" />
        <ReferenceField source="unitId" reference="units" label="Unidade" />
        <NumberField source="order" label="Ordem" />
      </Datagrid>
    </List>
  );
};
