"use client";

import {
  Edit,
  SimpleForm,
  NumberInput,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  useRecord,
} from "react-admin";
import { AiGenerateButton } from "./ai-generate-button";

interface MapLayout {
  courseId: number;
  world: {
    type: string;
    theme: string;
  };
  buildings: Array<{
    id: string;
    name: string;
    floors: Array<{
      level: number;
      name: string;
      rooms: Array<{
        id: string;
        name: string;
        type: string;
        unitIndex: number;
        lessonIndex: number;
      }>;
    }>;
  }>;
}

export const MapLayoutEdit = () => (
  <Edit>
    <MapLayoutEditContent />
  </Edit>
);

const MapLayoutEditContent = () => {
  const record = useRecord<MapLayout>();

  return (
    <div>
      {record && (
        <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-violet-900">
            Geracao Automatica
          </h3>
          <p className="mb-3 text-xs text-violet-700">
            Use IA para gerar um layout 3D baseado nas unidades e aulas do
            curso.
          </p>
          <AiGenerateButton
            courseId={record.courseId}
            courseName={`Curso #${record.courseId}`}
            units={
              record.buildings?.map((b) => ({
                name: b.name,
                lessons:
                  b.floors?.flatMap((f) =>
                    f.rooms?.map((r) => ({ name: r.name })) ?? []
                  ) ?? [],
              })) ?? []
            }
          />
        </div>
      )}

      <SimpleForm>
        <TextInput source="world.type" label="Tipo do Mundo" />
        <TextInput source="world.theme" label="Tema" />
        <ArrayInput source="world.groundSize" label="Tamanho do Chao [x, z]">
          <SimpleFormIterator>
            <NumberInput source="" label="" />
          </SimpleFormIterator>
        </ArrayInput>
        <ArrayInput source="buildings" label="Predios">
          <SimpleFormIterator>
            <TextInput source="id" label="ID" />
            <TextInput source="name" label="Nome" />
            <ArrayInput source="position" label="Posicao [x, y, z]">
              <SimpleFormIterator>
                <NumberInput source="" label="" />
              </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="floors" label="Andares">
              <SimpleFormIterator>
                <NumberInput source="level" label="Andar" />
                <TextInput source="name" label="Nome" />
                <ArrayInput source="rooms" label="Salas">
                  <SimpleFormIterator>
                    <TextInput source="id" label="ID" />
                    <TextInput source="name" label="Nome" />
                    <TextInput source="type" label="Tipo" />
                    <NumberInput source="unitIndex" label="Indice Unidade" />
                    <NumberInput source="lessonIndex" label="Indice Aula" />
                  </SimpleFormIterator>
                </ArrayInput>
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </div>
  );
};
