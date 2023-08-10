import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Rating
} from "@material-tailwind/react";
import React from "react";

export function ReviewDynamic({ userInfo }) {
  const getAvatar = (userInfo) => {
    const username = userInfo.username || "User";
    const avatar = userInfo.profile_pic_url || "";
    if (avatar && avatar.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      // If the profile_pic_url is a valid image URL
      return <img src={avatar} alt="Avatar" className="rounded-full w-8 h-8" />;
    } else {
      // If the profile_pic_url is invalid, display the first 2 characters of the username as the avatar
      return (
        <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">
          {username.slice(0, 2).toUpperCase()}
        </div>
      );
    }
  };
  const ratingNumber = Math.floor(userInfo.rating / 2);

  const [rated, setRated] = React.useState(ratingNumber);
  return (
    <Card
      color="transparent"
      shadow={false}
      className="w-full max-w-[40rem] m-4 shadow-md"
    >
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-8 ml-2 mr-2 mt-2"
      >
        {getAvatar(userInfo)}
        <div className="flex w-full flex-col gap-0.5 ">
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              {userInfo.username}
            </Typography>
            <div className="flex items-center gap-0">
            <div className="flex items-center gap-2">
      <Rating value={rated} onChange={(value) => setRated(value)} />
      <Typography color="blue-gray" className="font-medium">
        {rated}.0 Rated
      </Typography>
    </div>
            </div>
          </div>
          <Typography color="blue-gray">Frontend Lead @ Google</Typography>
        </div>
      </CardHeader>
      <CardBody className="mb-6 p-0 ml-2 mr-2">
        <Typography>{userInfo.review}</Typography>
      </CardBody>
    </Card>
  );
}
