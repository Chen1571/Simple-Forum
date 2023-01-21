import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { Input, Textarea, Button, useToast } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';

import Layout from 'components/layout';
import utilStyles from '/styles/utils.module.css';

export default function New_Post() {
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const toast = useToast();

  async function submitPost() {
    const token = getCookie('token'); //Legal here because function triggered on front end
    const res = await fetch('/api/post/newpost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postTitle, postText }),
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
    setPostTitle('');
    setPostText('');
    toast({
      title: 'Post Created!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
    Router.push('/forum/landing');
  }

  return (
    <Layout>
      <section className={utilStyles.headingMd}>
        <p>Add a new post here!</p>
      </section>
      <Input
        m="5"
        placeholder="Post Title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
      />
      <Textarea
        m="5"
        borderWidth="1px"
        resize="none"
        placeholder="Add your text here!"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <Button m="5" colorScheme="blue" onClick={submitPost}>
        Post!
      </Button>
      <br></br>
      <Link href="/forum/landing">← Back to forum</Link>
    </Layout>
  );
}
