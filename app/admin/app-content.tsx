"use client";

import { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import { useTheme } from "next-themes";
import simpleRestProvider from "ra-data-simple-rest";

import { i18nProvider } from "@/lib/admin-i18n";
import { darkTheme, lightTheme } from "@/lib/admin-theme";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./dashboard/Dashboard";

import { ChallengeCreate } from "./challenge/create";
import { ChallengeEdit } from "./challenge/edit";
import { ChallengeList } from "./challenge/list";
import { ChallengeOptionCreate } from "./challengeOption/create";
import { ChallengeOptionEdit } from "./challengeOption/edit";
import { ChallengeOptionsList } from "./challengeOption/list";
import { CourseCreate } from "./course/create";
import { CourseEdit } from "./course/edit";
import { CourseList } from "./course/list";
import { LessonCreate } from "./lesson/create";
import { LessonEdit } from "./lesson/edit";
import { LessonList } from "./lesson/list";
import { UnitCreate } from "./unit/create";
import { UnitEdit } from "./unit/edit";
import { UnitList } from "./unit/list";
import { UserProgressCreate } from "./userProgress/create";
import { UserProgressEdit } from "./userProgress/edit";
import { UserProgressList } from "./userProgress/list";
import { ChallengeProgressCreate } from "./challengeProgress/create";
import { ChallengeProgressEdit } from "./challengeProgress/edit";
import { ChallengeProgressList } from "./challengeProgress/list";
import { UserSubscriptionCreate } from "./userSubscription/create";
import { UserSubscriptionEdit } from "./userSubscription/edit";
import { UserSubscriptionList } from "./userSubscription/list";

import { GraduationCap } from "lucide-react";

const dataProvider = simpleRestProvider("/api");

const AppContent = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Admin
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      layout={Layout}
      dashboard={Dashboard}
      theme={mounted && theme === "dark" ? darkTheme : lightTheme}
      title="Aprova Mais Admin"
    >
      <Resource
        name="courses"
        recordRepresentation="title"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        icon={GraduationCap}
      />
      <Resource
        name="units"
        recordRepresentation="title"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
      />
      <Resource
        name="lessons"
        recordRepresentation="title"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
      />
      <Resource
        name="challenges"
        recordRepresentation="question"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
      />
      <Resource
        name="challengeOptions"
        recordRepresentation="text"
        list={ChallengeOptionsList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        options={{ label: "Opções" }}
      />
      <Resource
        name="userProgress"
        recordRepresentation="userName"
        list={UserProgressList}
        create={UserProgressCreate}
        edit={UserProgressEdit}
        options={{ label: "Usuários" }}
      />
      <Resource
        name="challengeProgress"
        recordRepresentation={(record: { id: number }) => `#${record.id}`}
        list={ChallengeProgressList}
        create={ChallengeProgressCreate}
        edit={ChallengeProgressEdit}
        options={{ label: "Progresso" }}
      />
      <Resource
        name="userSubscription"
        recordRepresentation={(record: { stripeSubscriptionId: string }) => record.stripeSubscriptionId}
        list={UserSubscriptionList}
        create={UserSubscriptionCreate}
        edit={UserSubscriptionEdit}
        options={{ label: "Assinaturas" }}
      />
    </Admin>
  );
};

export default AppContent;
