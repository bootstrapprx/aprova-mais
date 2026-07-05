"use client";

import {
  BooleanInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeOptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="text" validate={[required()]} label="Texto" multiline rows={3} fullWidth />
        <BooleanInput source="correct" label="Correta" />
        <ReferenceInput source="challengeId" reference="challenges" label="Questão" />
        <TextInput source="imageSrc" label="URL da Imagem" fullWidth />
        <TextInput source="audioSrc" label="URL do Áudio" fullWidth />
      </SimpleForm>
    </Edit>
  );
};
