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
        <TextInput source="userId" validate={[required()]} label="ID do Usuário" />
        <TextInput source="userName" label="Nome" />
        <TextInput source="userImageSrc" label="Avatar (URL)" />
        <ReferenceInput source="activeCourseId" reference="courses" label="Curso Ativo" />
        <NumberInput source="points" label="Pontos" defaultValue={0} />
      </SimpleForm>
    </Create>
  );
};
