"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { useGithubStats } from "@/hooks/fetch-github-data";
import { cn } from "@/lib/utils";

function GeneratedQuestions({ user, token }: { user: string; token: any }) {
  const { data, isLoading } = useGithubStats(user, token);

  const [inputs, setInputs] = useState<any>({});
  const [show, setShow] = useState(false);
  const [scores, setScores] = useState<{ [key: string]: boolean }>({});
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  useEffect(() => {
    if (isLoading) {
      // Change the loading message if data is not loaded within specific time intervals
      const timers = [
        setTimeout(
          () => setLoadingMessage("Personalizing your riddles..."),

          2000
        ), // changes message after 5 seconds
        setTimeout(() => setLoadingMessage("Almost there..."), 10000), // changes message after 10 seconds
      ];

      // Clear timeouts when data is loaded or component unmounts
      return () => timers.forEach(clearTimeout);
    } else {
      // Data loaded, reset loading message for next time
      setLoadingMessage("Loading...");
    }
  }, [isLoading]);

  const handleChange = (e: any) => {
    setInputs((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const checkAnswers = () => {
    let newScores: { [key: string]: boolean } = {};
    for (const question of data) {
      newScores[question.question] =
        inputs[question.answer] === question.answer;
    }
    setScores(newScores);
    setShow(true);
  };

  if (isLoading) {
    return <div className="mx-4 mt-4">{loadingMessage}</div>;
  }

  const formatRiddle = (riddle: string) => {
    return riddle
      .replace(/\n/g, " ")
      .replace(/ {2,}/g, " ")
      .replace(/,/g, "")
      .replace(/\./g, "")

      .trim();
  };

  return (
    <div className="mx-4 flex flex-col gap-5 mt-4 pb-5">
      <h1 className="text-2xl">Solve the Riddles</h1>
      {data?.map((question: any, index: number) => (
        <div className="flex flex-col gap-2" key={index}>
          <h3>
            Question {index + 1} of {data.length}
          </h3>
          <p className="text-md text-blue-400">
            {formatRiddle(question.question)}
          </p>
          <Input
            name={question.answer}
            onChange={handleChange}
            placeholder="Answer"
            className="w-full"
            disabled={show}
          />
          {show && (
            <div>
              <Card className="py-2">
                <CardBody
                  className={cn("px-3 py-0 text-small text-default-400", {
                    "text-success": scores[question.question],
                    "text-danger": !scores[question.question],
                  
                  })}
                >
                  Correct answer: {question.answer}
                </CardBody>
              </Card>
              <p>{scores[question.question] ? "Correct" : "Incorrect"}</p>
            </div>
          )}
        </div>
      ))}
      <Button
        className="w-full self-center"
        onClick={checkAnswers}
        color="primary"
        disabled={Object.keys(inputs).length !== data.length || show}
      >
        Check Answers
      </Button>
      <Button
        className="w-full self-center"
        onClick={() => {
          window.location.reload();
        }}
        color="danger"
      >
        Reset
      </Button>
    </div>
  );
}

export default GeneratedQuestions;
