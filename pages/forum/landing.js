import Head from 'next/head';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import timeSince from 'lib/timeSince';

import Layout, { siteTitle } from '/components/layout';
import utilStyles from '/styles/utils.module.css';
import PostPreview from '/components/post_preview';

export default function Landing({ postArray }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Forum landing page (Posts will show up here)</p>
      </section>
      {postArray == undefined ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error Loading posts!</AlertTitle>
        </Alert>
      ) : (
        postArray.map((e) => <PostPreview key={e.PK_post} postDetails={e}></PostPreview>)
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/api/post/posts`);
  const data = await res.json();

  const postArray = data.results;
  //Calculate time ago for each post and add to post object
  for (let i = 0; i < postArray.length; i++) {
    const timeSincePost = timeSince(new Date(postArray[i].post_date));
    postArray[i].timeSincePost = timeSincePost;
  }

  return { props: { postArray } };
}
