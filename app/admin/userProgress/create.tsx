"use client";

import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const UserProgressCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" fullWidth />
        <TextInput source="userName" label="Nome" fullWidth />
        <TextInput source="userImageSrc" label="Avatar (URL)" fullWidth />
        <ReferenceInput source="activeCourseId" reference="courses" label="Curso Ativo" />
        <NumberInput source="points" label="Pontos" defaultValue={0} fullWidth />
      </SimpleForm>
    </Create>
  );
};
