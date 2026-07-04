import { Datagrid, List, NumberField, ReferenceField, SelectField, TextField } from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" />
        <SelectField
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "TRUE_FALSE", name: "TRUE_FALSE" },
            { id: "MULTIPLE_CORRECT", name: "MULTIPLE_CORRECT" },
            { id: "TEXT_PASSAGE", name: "TEXT_PASSAGE" },
          ]}
        />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
