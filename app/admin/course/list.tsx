"use client";

import {
  BooleanField,
  Datagrid,
  ImageField,
  List,
  NumberField,
  TextField,
} from "react-admin";

export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" label="Edital" />
        <TextField source="banca" label="Banca" />
        <NumberField source="ano" label="Ano" />
        <TextField source="orgao" label="Órgão" />
        <BooleanField source="active" label="Ativo" />
        <ImageField source="imageSrc" label="Imagem" />
      </Datagrid>
    </List>
  );
};
