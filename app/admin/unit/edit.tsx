"use client";

import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Título" />
        <TextInput
          source="description"
          validate={[required()]}
          label="Descrição"
          multiline
          rows={3}
        />
        <ReferenceInput source="courseId" reference="courses" label="Curso" />
        <NumberInput source="order" validate={required()} label="Ordem" />
      </SimpleForm>
    </Edit>
  );
};
