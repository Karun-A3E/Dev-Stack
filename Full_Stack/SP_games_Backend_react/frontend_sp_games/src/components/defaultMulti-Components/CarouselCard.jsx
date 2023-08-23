import React from 'react'
import { Carousel } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import MessageCard from '../Cards/MessageCards';
import {
  Typography,
  IconButton
} from "@material-tailwind/react";

const CarouselCard = ({title,groupedGames,custom}) => {
  return (
    <div className="mt-24">
    <Typography className="mx-8" variant="h2">
      {title}
    </Typography>
    <hr className="w-full mt-2 mb-4" />
    <div className="flex flex-wrap lg:flex-nowrap justify-center">
      <Carousel
        className="rounded-xl flex justify-between"
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="black"
            size="lg"
            onClick={handlePrev}
            className="!absolute top-2/4 -translate-y-2/4 left-4"
          >
            <ArrowLeftIcon
              strokeWidth={2}
              className="w-6 h-6 decoration-pink-100"
            />
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="black"
            size="lg"
            onClick={() => {
              custom();
              handleNext();
            }}
            className="!absolute top-2/4 -translate-y-2/4 right-4"
          >
            <ArrowRightIcon strokeWidth={2} className="w-6 h-6" />
          </IconButton>
        )}
      >
        {groupedGames.map((batch) => (
          <div
            className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-2"
            style={{ position: "relative" }}
          >
            {batch.map((game) => (
              <div key={game.id} className="col-span-1">
                <MessageCard title={game.title} gameid={game.gameid}  platforms={game.platforms}/>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  </div>
  )
}

export default CarouselCard