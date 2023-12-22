"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import axios from "axios";
import { PiSpinnerGapLight } from "react-icons/pi";
import toast from "react-hot-toast";

const DisplayEmails = () => {
  const [input, setInput] = useState("");
  const [textarea, setTextarea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const getEmailData = async () => {
      try {
        if (isSubmitted) {
          const { data } = await axios.post("/api/generate", {
            email: input,
            prompt: textarea,
          });
          setTextarea(data.message.content);
          setIsLoading(false);
          setIsSubmitted(false);
        }
      } catch (error) {
        toast.error(`${error}`);
        setIsLoading(false);
        setIsSubmitted(false);
      }
    };
    getEmailData();
  }, [isSubmitted]);

  return (
    <div>
      <div className=" flex flex-col gap-4 w-full">
        <input
          type="text"
          className=" p-2 border-2 rounded-md"
          placeholder="john.doe@mail.com"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <textarea
          name=""
          id=""
          cols={30}
          rows={5}
          value={textarea}
          onChange={(e) => {
            setTextarea(e.target.value);
          }}
          className="p-2 border-2 rounded-md"
          placeholder="Write a persuasive follow-up email to [name] from [company name] who expressed interest in our services during [event where you met]"
        ></textarea>
        <Button
          onClick={() => {
            setIsSubmitted((prev) => !prev);
            setIsLoading(true);
          }}
          disabled={isLoading || !input}
        >
          {isLoading ? (
            <div>
              <PiSpinnerGapLight className=" animate-spin" />
            </div>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DisplayEmails;
