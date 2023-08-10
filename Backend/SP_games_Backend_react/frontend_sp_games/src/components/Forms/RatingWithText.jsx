// RatingWithText.js
import React from 'react';
import { Rating, Typography } from '@material-tailwind/react';

const RatingWithText = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Rating value={value} onChange={onChange} />
      <Typography color="blue-gray" className="font-medium">
        {value}.0 Rated
      </Typography>
    </div>
  );
};

export default RatingWithText;
