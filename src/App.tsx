import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import MaxMinCrop from './Pages/MaxMinCrop'

export default function App() {
  return <MantineProvider theme={theme}>
    <MaxMinCrop/>
    App
    </MantineProvider>;
}
