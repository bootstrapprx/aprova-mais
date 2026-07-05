"use client";

import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const UserProgressEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="userId" label="ID do Usuário" disabled />
        <TextInput source="userName" label="Nome" />
        <TextInput source="userImageSrc" label="Avatar (URL)" />
        <ReferenceInput source="activeCourseId" reference="courses" label="Curso Ativo" />
        <NumberInput source="points" label="Pontos" />
      </SimpleForm>
    </Edit>
  );
};
