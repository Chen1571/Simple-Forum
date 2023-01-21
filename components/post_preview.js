import Link from 'next/link';
import { LinkBox, Box, Heading } from '@chakra-ui/react';

export default function PostPreview({ postDetails }) {
  return (
    <LinkBox p="5" m="5" borderWidth="1px">
      <Box>
        Posted by {postDetails.username} {postDetails.timeSincePost} ago
      </Box>
      <Heading size="sm" my="2">
        <Link href={`/forum/post/${postDetails.PK_post}`}>{postDetails.title}</Link>
      </Heading>
    </LinkBox>
  );
}
