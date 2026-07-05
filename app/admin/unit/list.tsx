"use client";

import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const UnitList = () => {
  return (
    <List>
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
