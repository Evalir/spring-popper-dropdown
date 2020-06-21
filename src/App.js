import React, { useState, useEffect, useCallback } from "react"
import { usePopper } from "react-popper"
import { animated, useTransition } from "react-spring"
import "styled-components/macro"
import { unselectable } from "./utils"
import "./styles.css"

const SPRING = { mass: 0.4, tension: 400, friction: 20 }

// We need these as parcel complains about "animated" natively.
// This is probably due to some bad babel config internally.
const AnimDiv = animated.div
const AnimUl = animated.ul

function Dropdown() {
  const [opened, setOpened] = useState(false)
  const [name, setName] = useState("Linn")
  const [dropdownRef, setDropdownRef] = useState(null)
  const [menuRef, setMenuRef] = useState(null)
  const { styles, attributes } = usePopper(dropdownRef, menuRef, {
    placement: "bottom-start"
  })
  const transitions = useTransition(opened, null, {
    from: { opacity: 0, transform: "scale3d(0.90, 0.90, 1)" },
    enter: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    leave: { opacity: 0, transform: "scale3d(0.90, 0.90, 1)" },
    config: SPRING
  })

  const handleClick = useCallback(() => {
    setOpened(!opened)
  }, [opened])

  const handleDropButtonClick = useCallback(name => {
    setOpened(false)
    setName(name)
  }, [])

  const handleOutsideClick = useCallback(
    e => {
      if (
        dropdownRef &&
        menuRef &&
        (dropdownRef.contains(e.target) || menuRef.contains(e.target))
      ) {
        return
      }
      setOpened(false)
    },
    [dropdownRef, menuRef]
  )

  useEffect(() => {
    // listen for clicks and close dropdown on body
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [handleOutsideClick])

  useEffect(() => {
    if (dropdownRef) {
      dropdownRef.focus()
    }
  }, [dropdownRef])

  return (
    <>
      <button
        type="button"
        ref={setDropdownRef}
        onClick={handleClick}
        css={`
          position: relative;
          border: none;
          font-size: 16px;
          cursor: pointer;
          border: 1px solid #dde4ea;
          border-radius: 4px;
          padding: 8px 12px 8px 12px;
          min-width: 150px;
          transition: 0.08s;
          &:active {
            top: 1px;
            border-color: #3b8aff;
          }
          outline: 0;
          &::-moz-focus-inner {
            border: 0;
          }
          &:focus {
            outline: 0;
            border-color: #3b8aff;
          }
        `}
      >
        Names
      </button>
      {transitions.map(({ item, key, props: springStyle }) => {
        return (
          item && (
            <AnimDiv
              ref={setMenuRef}
              {...attributes.popper}
              style={{ ...styles.popper }}
              key={key}
              css={`
                position: absolute;
                top: 100%;
                left: 0;
                pointer-events: ${opened ? "auto" : "none"};
                padding: 0;
                margin: 0;
              `}
            >
              <AnimUl
                style={{ ...springStyle }}
                css={`
                  margin: 0;
                  padding: 0;
                  min-width: 160px;
                  border: 1px solid #dde4ea;
                  border-radius: 4px;
                  list-style-type: none;
                `}
              >
                <li
                  css={`
                    margin: 0;
                    padding: 0;
                  `}
                >
                  <button
                    onClick={() => handleDropButtonClick("Linn")}
                    css={`
                border: 0;
                border-radius: 4px 4px 0 0;
                margin: 0;
                padding 8px;
                height: 32px;
                width: 100%;
                cursor: pointer;
                &:hover {
                  background: #3b8aff;
                  color: white;
                }
                outline: 0;
                &::-moz-focus-inner {
                  border: 0;
                }
                &:focus {
                  outline: 0;
                  background: #3b8aff;
                }
                ${unselectable()}
            `}
                  >
                    Linn
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleDropButtonClick("Antena")}
                    css={`
                border: 0;
                border-radius: 0 0 4px 4px;
                margin: 0;
                padding 8px;
                height: 32px;
                width: 100%;
                cursor: pointer;
                transition: 0.08s;
                &:hover {
                  background: #3b8aff;
                  color: white;
                }
                outline: 0;
                &::-moz-focus-inner {
                  border: 0;
                }
                &:focus {
                  outline: 0;
                  background: #3b8aff;
                }
                ${unselectable()}
            `}
                  >
                    Antena
                  </button>
                </li>
              </AnimUl>
            </AnimDiv>
          )
        )
      })}
      <p>{name}</p>
    </>
  )
}

export default function App() {
  return (
    <div
      css={`
        margin-left: 32px;
      `}
    >
      <h1>Popper example</h1>
      <Dropdown />
    </div>
  )
}
