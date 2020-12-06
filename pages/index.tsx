import { GetServerSideProps } from 'next';


export const getServerSideProps = async (context) => {
  
    context.res.statusCode = 301;
    context.res.setHeader("Location", '/info');
    context.res.end("");
    return;

};

const Page = () => null;

export default Page;