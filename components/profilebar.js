import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Menu, MenuButton, MenuList, MenuItem, Stack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

import styles from '../components/profilebar.module.css';
import utilStyles from '../styles/utils.module.css';

const jwt = require('jsonwebtoken');

export default function Profilebar() {
  const [token, setToken] = useState('');
  const [busy, isBusy] = useState(true);

  useEffect(() => {
    const token = getCookie('token');
    setToken(token);
    isBusy(false);
  });

  return (
    <>
      {busy ? (
        <></>
      ) : token ? (
        <>
          <Stack spacing={4} direction="row" align="center">
            <Button colorScheme="orange">
              <Link href="/forum/new_post">New Post</Link>
            </Button>
            <Image
              priority
              src="/images/chromecorgi.png"
              className={utilStyles.borderCircle}
              height={60}
              width={60}
              alt=""
            />
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="15rem" colorScheme="blue">
                {jwt.decode(token).user.username}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    deleteCookie('token');
                    setToken('');
                    Router.push('/forum/landing'); //In future, use conditional redirect
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </>
      ) : (
        <Stack spacing={4} direction="row" align="center">
          <Link href="/forum/register" className={styles.orangeText}>
            Register
          </Link>
          <Link href="/forum/login" className={styles.orangeText}>
            Login
          </Link>
        </Stack>
      )}
    </>
  );
}
