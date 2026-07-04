import { Edit, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput, required } from "react-admin";

export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Questão" />
        <TextInput source="textoApoio" label="Texto de Apoio" multiline rows={4} />
        <SelectInput
          source="type"
          validate={[required()]}
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "TRUE_FALSE", name: "TRUE_FALSE" },
            { id: "MULTIPLE_CORRECT", name: "MULTIPLE_CORRECT" },
            { id: "TEXT_PASSAGE", name: "TEXT_PASSAGE" },
          ]}
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={required()} label="Ordem" />
      </SimpleForm>
    </Edit>
  );
};
