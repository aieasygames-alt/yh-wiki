import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FaqSection } from "../FaqSection";

const faqs = [
  {
    question: "What is NTE?",
    questionZh: "什么是异环？",
    answer: "NTE is a game.",
    answerZh: "异环是一款游戏。",
  },
  {
    question: "How to play?",
    questionZh: "怎么玩？",
    answer: "Download and play.",
    answerZh: "下载并游玩。",
  },
];

describe("FaqSection", () => {
  it("renders FAQ section with zh locale", () => {
    render(<FaqSection faqs={faqs} locale="zh" />);
    expect(screen.getByText("异环攻略 FAQ")).toBeInTheDocument();
  });

  it("renders FAQ section with en locale", () => {
    render(<FaqSection faqs={faqs} locale="en" />);
    expect(screen.getByText("NTE FAQ")).toBeInTheDocument();
  });

  it("shows first FAQ answer by default (openIndex=0)", () => {
    render(<FaqSection faqs={faqs} locale="zh" />);
    expect(screen.getByText("异环是一款游戏。")).toBeInTheDocument();
  });

  it("hides second FAQ answer initially", () => {
    render(<FaqSection faqs={faqs} locale="zh" />);
    expect(screen.queryByText("下载并游玩。")).not.toBeInTheDocument();
  });

  it("opens second FAQ on click", () => {
    render(<FaqSection faqs={faqs} locale="zh" />);
    const secondQuestion = screen.getByText("怎么玩？");
    fireEvent.click(secondQuestion);
    expect(screen.getByText("下载并游玩。")).toBeInTheDocument();
  });

  it("closes FAQ when clicking open question again", () => {
    render(<FaqSection faqs={faqs} locale="zh" />);
    const firstQuestion = screen.getByText("什么是异环？");
    fireEvent.click(firstQuestion);
    expect(screen.queryByText("异环是一款游戏。")).not.toBeInTheDocument();
  });

  it("renders nothing when faqs array is empty", () => {
    const { container } = render(<FaqSection faqs={[]} locale="zh" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when faqs is null", () => {
    const { container } = render(<FaqSection faqs={null as unknown as { question: string; questionZh: string; answer: string; answerZh: string }[]} locale="zh" />);
    expect(container.innerHTML).toBe("");
  });

  it("shows en questions in en locale", () => {
    render(<FaqSection faqs={faqs} locale="en" />);
    expect(screen.getByText("What is NTE?")).toBeInTheDocument();
    expect(screen.getByText("How to play?")).toBeInTheDocument();
  });
});
