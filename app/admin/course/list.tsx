import { Datagrid, List, NumberField, TextField } from "react-admin";

export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" />
        <TextField source="banca" />
        <NumberField source="ano" />
        <TextField source="orgao" />
        <TextField source="imageSrc" />
      </Datagrid>
    </List>
  );
};
