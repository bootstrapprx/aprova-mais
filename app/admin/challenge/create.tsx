"use client";

import {
  Create,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          source="question"
          validate={[required()]}
          label="Questão"
          multiline
          rows={3}
        />
        <TextInput
          source="textoApoio"
          label="Texto de Apoio"
          multiline
          rows={4}
        />
        <SelectInput
          source="type"
          validate={[required()]}
          label="Tipo"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "TRUE_FALSE", name: "VERDADEIRO/FALSO" },
            { id: "MULTIPLE_CORRECT", name: "MÚLTIPLA CORRETA" },
            { id: "TEXT_PASSAGE", name: "TEXTO" },
          ]}
        />
        <ReferenceInput source="lessonId" reference="lessons" label="Aula" />
        <NumberInput source="order" validate={required()} label="Ordem" />
      </SimpleForm>
    </Create>
  );
};
