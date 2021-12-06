/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { memo, useEffect, useState } from "react";

export const WorkItemName = memo(
  ({
    onKeyDownInputBox,
    handleItemClick,
    handleItemDoubleClick,
    checkedItems,
    item,
    itemBeingEdited,
    isFocused,
    handleItemBlurEvent,
  }) => {
    const [inputValue, setInputValue] = useState(null);

    useEffect(() => {
      setInputValue(item.name);
    }, [item.name]);

    const styles = {
      inputSelected: {
        "& > * > * > *": {
          backgroundColor: "#EBFAE2 !important",
        },
      },
    };
    return (
      <div
        {...css(checkedItems.includes(item.workitemid) && styles.inputSelected)}
      >
        {!item.workitemid ? (
          <FormInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleItemDoubleClick={handleItemDoubleClick}
            onKeyDownInputBox={onKeyDownInputBox}
            item={item}
            itemBeingEdited={itemBeingEdited}
            isFocused={true}
            handleItemBlurEvent={handleItemBlurEvent}
          />
        ) : (
          <>
            {isFocused || item.workitemid === itemBeingEdited ? (
              <FormInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onKeyDownInputBox={onKeyDownInputBox}
                handleItemDoubleClick={handleItemDoubleClick}
                item={item}
                itemBeingEdited={itemBeingEdited}
                isFocused={isFocused}
                handleItemBlurEvent={handleItemBlurEvent}
              />
            ) : (
              <Name
                item={item}
                handleItemClick={handleItemClick}
                handleItemDoubleClick={handleItemDoubleClick}
              />
            )}
          </>
        )}
      </div>
    );
  }
);

const FormInput = memo(
  ({
    inputValue,
    setInputValue,
    onKeyDownInputBox,
    handleItemDoubleClick,
    item,
    itemBeingEdited,
    isFocused,
    handleItemBlurEvent,
  }) => {

    return (
      <input data-cy="workitem-name-input-93995" 
        autoFocus={isFocused}
        value={inputValue || ""}
        style={{ minHeight: "25px" }}
        className="fix_workitem_list_paragraph_16 fix_focus_background_grey1"
        onKeyDown={(event) => {
          onKeyDownInputBox(event, {
            id: item.id,
            inputValue,
            workitemid: item.workitemid,
          });
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onDoubleClick={() => handleItemDoubleClick(item.workitemid)}
        onBlur={() => handleItemBlurEvent(item, inputValue)}
      />
    );
  }
);

const Name = memo(({ item, handleItemClick, handleItemDoubleClick }) => {
  const styles = {
    title: {
      minHeight: "25px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      position: "relative",
      top: "3px",
    },
  };
  return (
    <div
      {...css(styles.title)}
      onClick={() => handleItemClick(item.workitemid)}
      onDoubleClick={() => handleItemDoubleClick(item.workitemid)}
      className="fix_workitem_list_paragraph_16"
    >
      {item.title}
    </div>
  );
});
