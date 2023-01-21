import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Heading, Textarea, Divider, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import Layout from '/components/layout';
import PostComment from '/components/post_comment';
import timeSince from 'lib/timeSince';

const commentPlaceholder = 'What are your thoughts?';

export default function Post({ postDetails, commentArray }) {
  const [newComment, setNewComment] = useState('');
  const toast = useToast();
  const router = useRouter();

  async function submitComment() {
    const postPk = postDetails.PK_post;
    const res = await fetch('/api/comment/newcomment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newComment, postPk }),
    });
    if (res.status == 400) {
      const errMsg = await res.text();
      toast({
        title: errMsg,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setNewComment('');
    toast({
      title: 'Comment Created!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
    router.replace(router.asPath); //Refresh comments
  }

  return (
    <Layout>
      <Box p="5" m="5" borderWidth="1px">
        <Box>
          Posted by {postDetails.username} {postDetails.timeSincePost} ago
        </Box>
        <Heading size="md" my="5">
          {postDetails.title}
        </Heading>
        <Box>{postDetails.text}</Box>
      </Box>
      <Box p="5" m="5">
        <Textarea
          p="5"
          borderWidth="1px"
          resize="none"
          placeholder={commentPlaceholder}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button m="5" colorScheme="blue" onClick={submitComment}>
          Comment
        </Button>
      </Box>
      <Divider></Divider>
      {commentArray.map((e) => (
        <PostComment key={e.PK_comment} commentDetails={e}></PostComment>
      ))}
      <Link href="/forum/landing">← Back to forum</Link>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const res = await fetch(`http://localhost:3000/api/post/${id}`);
  const data = await res.json();

  const postDetails = data.results.postDetails[0];
  postDetails.timeSincePost = timeSince(new Date(postDetails.post_date));
  const commentArray = data.results.comments;
  for (let i = 0; i < commentArray.length; i++) {
    const timeSinceComment = timeSince(new Date(commentArray[i].post_date));
    commentArray[i].timeSinceComment = timeSinceComment;
  }

  return { props: { postDetails, commentArray } };
}
