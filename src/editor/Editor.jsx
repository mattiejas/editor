import * as styles from "./Editor.module.scss";

import { React, useEffect, useState } from "react";

import { Line } from "./Line";

export const Editor = () => {
  const [lines, setLines] = useState(["Type something to get started. Press Enter for a new line."]);
  const [el, setEl] = useState(null);
  const [elIndex, setElIndex] = useState(0);
  const [caretIndex, setCaretIndex] = useState(0);
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => { 
      window.removeEventListener("keydown", keyDown); 
      window.removeEventListener("keyup", keyUp); 
    }
  });

  useEffect(() => {
    setEl(document.getElementById(`line-${elIndex}`));
  }, [elIndex]);

  const keyDown = (e) => {
    console.log(e);

    if (e.key === "ArrowUp" && !shiftPressed && !e.ctrlKey) {
      setElIndex(Math.max(0, elIndex - 1));
    } else if (e.key === "ArrowDown" && !shiftPressed && !e.ctrlKey) {
      setElIndex(Math.min(elIndex + 1, lines.length - 1));
    } else if (e.key === "ArrowLeft" && !shiftPressed && !e.ctrlKey) {
      setCaretIndex(Math.max(0, caretIndex - 1));
    } else if (e.key === "ArrowRight" && !shiftPressed && !e.ctrlKey) {
      setCaretIndex(Math.min(caretIndex + 1, el.childNodes[0].length));
    } else if (e.key === "Shift") {
      setShiftPressed(true);
    } else {
      setCaretIndex(getCaretIndex(el));
    }
  };

  const keyUp = (e) => {
    if (e.key === "Shift") {
      setShiftPressed(false);
    }
  }

  useEffect(() => {
    if (el && el.childNodes.length) {
      console.log(caretIndex, el.childNodes[0].length);
      setCaretToElement(el, caretIndex <= el.childNodes[0].length ? caretIndex : el.childNodes[0].length);
    }
  }, [lines, el, caretIndex]);

  const updateLine = (e, i) => {
    const text = e.target.innerHTML;
    const newLines = [...lines.slice(0, i), text, ...lines.slice(i + 1)];

    setCaretIndex(getCaretIndex(e.target));
    setLines(newLines);
  };

  const addLine = () => setLines([...lines, " "]);

  const setCurrentElement = (el) => {
    setEl(el.target);
    const index = el.target.id.split("-")[1];
    setElIndex(Number(index));

    const caretIdx = getCaretIndex(el.target);
    console.log(caretIdx);
    setCaretIndex(caretIdx);
  };

  const getCaretIndex = (element) => {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection.rangeCount !== 0) {
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        position = preCaretRange.toString().length;
      }
    }
    return position;
  };

  const setCaretToElement = (element, i) => {
    const range = document.createRange();
    const selection = window.getSelection();
    const text = element.childNodes[0];

    if (text) {
      range.setStart(element.childNodes[0], i);
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };

  const onLineEnter = (e) => {
    if (e.key === "Enter") e.preventDefault();

    // add new line
    if (e.key === "Enter" && lines.length - 1 === elIndex) {
      addLine();
      setElIndex(elIndex + 1);
    }
  };

  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} className={styles.Line}>
          <div className={styles.LineNumber}>{i}</div>
          <Line
            id={`line-${i}`}
            className={styles.LineContent}
            text={l}
            onUpdate={(e) => updateLine(e, i)}
            onFocus={(e) => setCurrentElement(e)}
            onKeyDown={(e) => onLineEnter(e)}
          />
        </div>
      ))}
    </div>
  );
};
