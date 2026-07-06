"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { ResultCard } from "./result-card";

type QuizProps = {
  initialPercentage: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialLessonId,
  initialLessonChallenges,
  userSubscription: _userSubscription,
}: QuizProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const { width, height } = useWindowSize();

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [correctCount, setCorrectCount] = useState(0);

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const isMultiple = challenge?.type === "MULTIPLE_CORRECT";

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    if (isMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(id)
          ? prev.filter((o) => o !== id)
          : [...prev, id]
      );
    } else {
      setSelectedOptions([id]);
    }
  };

  const isCorrect = () => {
    const correctIds = options
      .filter((o) => o.correct)
      .map((o) => o.id)
      .sort();

    const sortedSelected = [...selectedOptions].sort();

    return (
      correctIds.length === sortedSelected.length &&
      correctIds.every((id, i) => id === sortedSelected[i])
    );
  };

  const onContinue = () => {
    if (selectedOptions.length === 0) return;

    if (status === "wrong") {
      onNext();
      setStatus("none");
      setSelectedOptions([]);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOptions([]);
      return;
    }

    if (isCorrect()) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((result) => {
            if (result?.error) {
              toast.error(result.error);
              return;
            }
            void correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);
            setCorrectCount((prev) => prev + 1);
          })
          .catch(() => toast.error("Algo deu errado. Tente novamente."));
      });
    } else {
      void incorrectControls.play();
      setStatus("wrong");
      setPercentage((prev) => prev + 100 / challenges.length);
    }
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />

          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />

          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Simulado concluído!
          </h1>

          <p className="text-base text-neutral-500">
            Você acertou {correctCount} de {challenges.length} questões (
            {Math.round((correctCount / challenges.length) * 100)}% de acertos)
          </p>

          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="acertos" value={correctCount} />
          </div>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header percentage={percentage} />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            {challenge.textoApoio && (
              <div className="rounded-xl border-2 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700 lg:text-base">
                {challenge.textoApoio}
              </div>
            )}

            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {challenge.question}
            </h1>

            <div>
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOptions={selectedOptions}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        disabled={pending || selectedOptions.length === 0}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
