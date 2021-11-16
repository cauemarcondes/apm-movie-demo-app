import React from "react";
//@ts-ignore
import { withTransaction } from "@elastic/apm-rum-react";

function Home() {
  return <div>Home</div>;
}

export default withTransaction("Home", "component")(Home);
