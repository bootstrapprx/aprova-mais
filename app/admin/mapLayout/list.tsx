import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
} from "react-admin";

export const MapLayoutList = () => (
  <List>
    <Datagrid>
      <NumberField source="courseId" label="Curso ID" />
      <TextField source="world.type" label="Tipo" />
      <TextField source="world.theme" label="Tema" />
      <EditButton />
    </Datagrid>
  </List>
);
