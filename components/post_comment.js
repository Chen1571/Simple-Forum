import { Box } from "@chakra-ui/react";

export default function PostComment({ commentDetails }) {
  return (
    <Box p="5" m="5" borderWidth="1px">
      <Box>Posted by {commentDetails.username} {commentDetails.timeSinceComment} ago</Box>
      <Box my="5">{commentDetails.text}</Box>
    </Box>
  );
}