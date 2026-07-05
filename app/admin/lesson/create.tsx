"use client";

import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const LessonCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Título" fullWidth />
        <ReferenceInput source="unitId" reference="units" label="Unidade" />
        <NumberInput source="order" validate={required()} label="Ordem" fullWidth />
      </SimpleForm>
    </Create>
  );
};
