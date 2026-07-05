"use client";

import {
  AutocompleteInput,
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { ImagePreviewInput } from "./ImagePreviewInput";
import { BANCA_CHOICES, ORGAO_CHOICES } from "./constants";

export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <SectionTitle title="Dados do Concurso" />
        <TextInput source="title" validate={[required()]} label="Edital" fullWidth />
        <TextInput
          source="description"
          label="Descrição"
          multiline
          rows={4}
          fullWidth
          helperText="Breve descrição do concurso (opcional)"
        />
        <AutocompleteInput
          source="banca"
          validate={[required()]}
          label="Banca"
          choices={BANCA_CHOICES}
          fullWidth
        />
        <AutocompleteInput
          source="orgao"
          validate={[required()]}
          label="Órgão"
          choices={ORGAO_CHOICES}
          fullWidth
        />
        <NumberInput
          source="ano"
          validate={[required()]}
          label="Ano"
          min={2000}
          max={2030}
          fullWidth
        />
        <BooleanInput source="active" label="Curso ativo" />
        <Box sx={{ height: 24 }} />
        <SectionTitle title="Identidade Visual" />
        <ImagePreviewInput
          source="imageSrc"
          validate={[required()]}
          label="Imagem (URL)"
          helperText="URL da bandeira ou brasão representando o concurso"
        />
      </SimpleForm>
    </Edit>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 600,
      color: "primary.main",
      mb: 1,
      mt: 1,
      borderBottom: "1px solid",
      borderColor: "divider",
      pb: 0.5,
      fontSize: "0.95rem",
    }}
  >
    {title}
  </Typography>
);
