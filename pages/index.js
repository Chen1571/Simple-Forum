import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Welcome to "Forum"</p>
      </section>
      <br></br>
      <h2>
        <Link href="/forum/landing">Go to the forum! →</Link>
      </h2>
    </Layout>
  );
}
