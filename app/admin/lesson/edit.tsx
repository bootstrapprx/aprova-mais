"use client";

import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const LessonEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Título" />
        <ReferenceInput source="unitId" reference="units" label="Unidade" />
        <NumberInput source="order" validate={required()} label="Ordem" />
      </SimpleForm>
    </Edit>
  );
};
