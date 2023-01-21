import Link from 'next/link';
import { Stack } from '@chakra-ui/react';

import Profilebar from './profilebar';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.container}>
      <Stack spacing={4} direction="row" align="center">
        <Link href="/">Home</Link>
        <Link href="/forum/landing">Landing</Link>
      </Stack>
      <div className={styles.rightNavBox}>
        <Profilebar></Profilebar>
      </div>
    </div>
  );
}
