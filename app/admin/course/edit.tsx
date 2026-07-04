import { Edit, NumberInput, SimpleForm, TextInput, required } from "react-admin";

export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" validate={[required()]} label="Id" />
        <TextInput source="title" validate={[required()]} label="Edital" />
        <TextInput source="banca" validate={[required()]} label="Banca" />
        <NumberInput source="ano" validate={[required()]} label="Ano" />
        <TextInput source="orgao" validate={[required()]} label="Órgão" />
        <TextInput source="imageSrc" validate={[required()]} label="Imagem" />
      </SimpleForm>
    </Edit>
  );
};
