import { ThirdwebProvider } from "@thirdweb-dev/react";
import Component from "./components/Component";

export default function App() {
  return (
    <ThirdwebProvider activeChain="goerli">
      <Component />
    </ThirdwebProvider>
  );
}
