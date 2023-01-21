import Head from 'next/head';
import { Button, Input, FormControl, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import Layout, { siteTitle } from '/components/layout';
import utilStyles from '/styles/utils.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerErr, setRegisterErr] = useState('');
  const toast = useToast();

  async function submitRegister() {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (res.status == 400) {
      const errMsg = await res.text();
      setRegisterErr(errMsg);
      return;
    }
    setUsername('');
    setPassword('');
    setRegisterErr('');
    toast({
      title: 'User created!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
    //Use Router.push to redirect
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Forum Register Page</p>
        <FormControl isInvalid={registerErr}>
          <Input
            placeholder="Username"
            size="sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormErrorMessage>{registerErr}</FormErrorMessage>
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
          <Button colorScheme="blue" onClick={submitRegister}>
            Register
          </Button>
        </FormControl>
      </section>
    </Layout>
  );
}
