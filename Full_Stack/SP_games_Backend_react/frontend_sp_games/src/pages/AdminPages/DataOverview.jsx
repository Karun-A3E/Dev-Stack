import React, { useState } from "react";

import GameInfo from "../../components/Admin/GameInfo";
import PlatformInfo from "../../components/Admin/PlatformInfo";
import CategoryInfo from "../../components/Admin/CategoryInfo";
import OrderInfo from "../../components/Admin/OrderInfo";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
const DataOverview = () => {

  const [open, setOpen] = React.useState(1);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (

    <div className="m-6">
      <Accordion open={open === 1}>
        <AccordionHeader onClick={() => handleOpen(1)}>
          Games Database
        </AccordionHeader>
        <AccordionBody>
          <GameInfo />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2}>
        <AccordionHeader onClick={() => handleOpen(2)}>
          Platform Database
        </AccordionHeader>
        <AccordionBody>
          <PlatformInfo />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3}>
        <AccordionHeader onClick={() => handleOpen(3)}>
          Category Database
        </AccordionHeader>
        <AccordionBody>
          <CategoryInfo />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4}>
        <AccordionHeader onClick={() => handleOpen(4)}>
          Order Database
        </AccordionHeader>
        <AccordionBody>
          <OrderInfo />
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default DataOverview;
