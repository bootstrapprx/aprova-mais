"use client";

import {
  Datagrid,
  ImageField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const UserProgressList = () => {
  return (
    <List>
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
