import type { NextPage } from "next";
import Head from "next/head";
import { PredictionsView } from "../views";

const Predictions: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Predictions</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <PredictionsView />
    </div>
  );
};


export default Predictions;
