import { Container } from "@mui/material";
import Navbar from "./Navbar";

const RootLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default RootLayout;
