import React from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages";

const App = () => {
  return (
    <main>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
