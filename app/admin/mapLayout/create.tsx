import {
  Create,
  SimpleForm,
  NumberInput,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from "react-admin";

export const MapLayoutCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="courseId" validate={required()} label="Curso ID" />
      <TextInput source="world.type" defaultValue="building_board" label="Tipo do Mundo" />
      <TextInput source="world.theme" defaultValue="default" label="Tema" />
      <ArrayInput source="buildings" label="Prédios">
        <SimpleFormIterator>
          <TextInput source="id" label="ID" />
          <TextInput source="name" label="Nome" />
          <ArrayInput source="floors" label="Andares">
            <SimpleFormIterator>
              <NumberInput source="level" label="Andar" />
              <TextInput source="name" label="Nome" />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
