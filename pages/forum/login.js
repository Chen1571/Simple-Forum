import Head from 'next/head';
import Router from 'next/router';
import { Button, Input, FormControl, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import Layout, { siteTitle } from '/components/layout';
import utilStyles from '/styles/utils.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  async function submitLogin() {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //Needed to not require JSON.parse() in API
      },
      body: JSON.stringify({ username, password }),
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
    //Legal login here
    //const token = res.token;
    await res.json();
    setUsername('');
    setPassword('');
    toast({
      title: 'User logged in!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
    Router.push('/forum/landing');
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Login to the forum here!</p>
        <FormControl>
          <Input
            placeholder="Username"
            size="sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            placeholder="Password"
            size="sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <br></br>
          <Button colorScheme="blue" onClick={submitLogin}>
            Login
          </Button>
        </FormControl>
      </section>
    </Layout>
  );
}
