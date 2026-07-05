"use client";

import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UnitCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Título" fullWidth />
        <TextInput source="description" validate={[required()]} label="Descrição" multiline rows={3} fullWidth />
        <ReferenceInput source="courseId" reference="courses" label="Curso" />
        <NumberInput source="order" validate={required()} label="Ordem" fullWidth />
      </SimpleForm>
    </Create>
  );
};
