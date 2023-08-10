import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Rating 
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  StarIcon,
  HeartIcon,
  WifiIcon,
  HomeIcon,
  TvIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function MessageCard({ title, gameid, profile_pic_url, platforms, price }) {
  const truncatedTitle = title.length > 15 ? title.slice(0, 29) + "..." : title;
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Programmatically navigate to the desired route
    navigate(`/game/${gameid}`);
  };

  const displayPlatforms = () => {
    if (platforms && platforms.length > 0 && !price) {
      return platforms;
    } else if (platforms && price) {
      return `Platform : ${platforms} | Price: ${price}`;
    } else {
      return "No platform information available";
    }
  };

  return (
    <Card className="w-full max-w-[18rem] shadow-lg py-2" onClick={handleCardClick}>
      <CardHeader floated={false} color="blue-gray">
        <div className="w-full h-30 overflow-hidden rounded-t-lg">
          <img
            src={
              profile_pic_url == null
                ? "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                : profile_pic_url
            }
            alt="ui/ux review check"
            className="w-full h-auto"
          />
        </div>
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
        <IconButton
          size="sm"
          color="red"
          variant="text"
          className="!absolute top-4 right-4 rounded-full"
        >
          {/* Optional icon for some action */}
        </IconButton>
      </CardHeader>
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="font-medium">
            {truncatedTitle}
          </Typography>
        </div>
        {displayPlatforms() && (
          <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal">
            {displayPlatforms()}
          </Typography>
        )}
      </CardBody>
    </Card>
  );
}
