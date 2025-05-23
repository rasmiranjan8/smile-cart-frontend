import { React, useRef } from "react";

import { VALID_COUNT_REGEX } from "components/constants";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Button, Input, Toastr } from "neetoui";

import TooltipWrapper from "./TooltipWrapper";

import useSelectedQuantity from "../hooks/useSelectedQuantity";

const ProductQuantity = ({ slug }) => {
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
  const { data: product = {} } = useShowProduct(slug);

  const { availableQuantity } = product;
  const parsedSelectedQuantity = parseInt(selectedQuantity) || 0;
  const isNotValidQuantity = parsedSelectedQuantity > availableQuantity;

  const preventNavigation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  const countInputFocus = useRef(null);

  const handleSetCount = event => {
    const { value } = event.target;
    const parsedValue = parseInt(value);
    const isNotValidInputQuantity =
      isNaN(parsedValue) || parsedValue > availableQuantity;

    if (isNotValidInputQuantity) {
      Toastr.error(`Only ${availableQuantity} units are available`, {
        autoClose: 2000,
      });
      setSelectedQuantity(availableQuantity);
      countInputFocus.current.blur();
    } else if (VALID_COUNT_REGEX.test(value)) {
      setSelectedQuantity(value);
    }
  };

  return (
    <div className="neeto-ui-border-black neeto-ui-rounded inline-flex flex-row items-center border">
      <Button
        className="focus-within:ring-0"
        label="-"
        style="text"
        onClick={e => {
          preventNavigation(e);
          if (parsedSelectedQuantity > 0) {
            setSelectedQuantity(parsedSelectedQuantity - 1);
          }
        }}
      />
      <Input
        ref={countInputFocus}
        value={selectedQuantity}
        onClick={e => {
          handleSetCount(e);
          preventNavigation(e);
        }}
        nakedInput
        // className="ml-2"
        contentSize="2"
      />

      <TooltipWrapper
        content="Reached maximum units"
        position="top"
        showTooltip={isNotValidQuantity}
      >
        <Button
          className="focus-within:ring-0"
          disabled={isNotValidQuantity}
          label="+"
          style="text"
          onClick={e => {
            preventNavigation(e);
            if (parsedSelectedQuantity < availableQuantity) {
              setSelectedQuantity(parsedSelectedQuantity + 1);
            }
          }}
        />
      </TooltipWrapper>
    </div>
  );
};

export default ProductQuantity;
