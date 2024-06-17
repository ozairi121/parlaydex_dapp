import type { NextPage } from "next";
import Head from "next/head";
import { MarketsView } from "../views";

const Markets: NextPage = (props) => {
  return (
    <div className="w-full">
      <Head>
        <title>Available Markets</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <MarketsView />
    </div>
  );
};


export default Markets;
