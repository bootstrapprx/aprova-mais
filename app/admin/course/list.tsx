"use client";

import {
  BooleanField,
  BooleanInput,
  Datagrid,
  Filter,
  ImageField,
  List,
  NumberField,
  NumberInput,
  SearchInput,
  SelectInput,
  TextField,
} from "react-admin";

import { BANCA_CHOICES, ORGAO_CHOICES } from "./constants";

const CourseFilter = () => (
  <Filter>
    <SearchInput source="q" alwaysOn />
    <SelectInput source="banca" label="Banca" choices={BANCA_CHOICES} />
    <SelectInput source="orgao" label="Órgão" choices={ORGAO_CHOICES} />
    <NumberInput source="ano" label="Ano" />
    <BooleanInput source="active" label="Ativo" />
  </Filter>
);

export const CourseList = () => {
  return (
    <List filters={<CourseFilter />}>
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
