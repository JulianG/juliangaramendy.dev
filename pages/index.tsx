import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async (context) => {
  
  return { redirect: { destination: '/info', permanent: true}}

};

const Page = () => null;

export default Page;