"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import axios from "axios";
import { PiSpinnerGapLight } from "react-icons/pi";
import toast from "react-hot-toast";
import { useChat } from "ai/react";

const DisplayEmails = () => {
  const [email, setEmail] = useState("");
  const [textarea, setTextarea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/generate",
    sendExtraMessageFields: true,
    body: {
      email,
    },
  });

  return (
    <div className="w-full lg:w-[50%] flex justify-center items-center p-8 ">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          if (messages.length > 0) {
            setMessages([]);
          }
        }}
        className="w-full"
      >
        <div className=" flex flex-col gap-4 w-full">
          <input
            type="text"
            className=" p-2 border-2 rounded-md"
            placeholder="john.doe@mail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <textarea
            name=""
            id=""
            cols={30}
            rows={5}
            value={input}
            onChange={handleInputChange}
            className={`${
              messages.length === 0 ? "mt-2 p-2" : "hidden"
            } border-2 rounded-md`}
            placeholder="Write a persuasive follow-up email to [name] from [company name] who expressed interest in our services during [event where you met]"
          ></textarea>
          <ul
            className={`${
              messages.length > 0 ? "mt-2 p-2" : "hidden"
            } border-2 rounded-md h-[40vh] w-full bg-white overflow-y-scroll`}
          >
            {messages.length > 1 ? (
              messages.map((m, index) => {
                if (index === 0) return;
                return (
                  <li key={index}>
                    {/* {m.role === "user" ? "User: " : "AI: "} */}
                    {m.content}
                  </li>
                );
              })
            ) : (
              <div className=" w-full h-full flex justify-center items-center">
                <PiSpinnerGapLight className=" animate-spin text-black text-2xl" />
              </div>
            )}
          </ul>
          <Button
            type="submit"
            disabled={isLoading || !email || (!input && messages.length === 0)}
          >
            {isLoading ? (
              <div>
                <PiSpinnerGapLight className=" animate-spin" />
              </div>
            ) : (
              <div> {messages.length > 0 ? "Clear" : "Generate"}</div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisplayEmails;
